import {Redis} from '@upstash/redis'
import {Ratelimit} from '@upstash/ratelimit'
import {NextRequest, NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import {deleteToken, validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '40 s')
})
const rateLimitRecovery = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h')
})
const rateLimitSearch = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(2, '30 s')
})
export async function proxy(req:NextRequest) {
  const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.vercel-insights.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://*.imgur.com data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
 `
  const cspValue = cspHeader.replace(/\n/g, ' ').trim()
  const reqHeaders = new Headers(req.headers)
  reqHeaders.set('Content-Security-Policy', cspValue)
  const responseWithCsp = NextResponse.next({
    request:{
      headers: reqHeaders,
    },
  });

  responseWithCsp.headers.set('Content-Security-Policy', cspValue)
  const url = req.nextUrl.pathname;

  if(url.startsWith('/_next')|| url.includes('/api/getDataUser')) {
    return responseWithCsp
  }
  if(url === '/api/login'||url === '/api/register' || url === '/api/verifyEmail' || url === '/api/sendRecoveryCode'|| url === '/api/confirmRecoveryCode' || url === '/api/changeAvatar' || url === '/api/refreshData' || url === '/api/changePassword' || url==='/api/getDeviceList') {
    const response = await rateLimiterMiddleware(req)
    if(response){
      return response
    }
  }
  if(url === '/api/resetPassword'){
    const response = await rateLimiterRecovery(req)
    if(response){
      return response
    }
  }
  const tokenResponse = await tokenMiddleware(req, responseWithCsp)
  if(tokenResponse){
    return tokenResponse
  }
  return responseWithCsp
}
export async function rateLimiterSearch(req:Request) {
  const ip = req.headers.get('x-forwarded-for')??'anonymous'
  const {success, reset} = await rateLimitSearch.limit(ip)
  if(!success){
    const now = Date.now()
    const timeLeft = Math.floor((reset - now)/1000)
    return NextResponse.json({error:timeLeft, status:429}, {status:429})
  }
}
async function rateLimiterRecovery(req:Request) {
  const ip = req.headers.get('x-forwarded-for')??'anonymous'
  const {success} = await rateLimitRecovery.limit(ip)
  if(!success) {
    return NextResponse.json({ok: false, error: 'Слишком много запросов'}, {status:429})
  }
}
async function rateLimiterMiddleware(req: Request){
  const ip =  req.headers.get('x-forwarded-for')??'anonymous'

  const { success } = await rateLimit.limit(ip)
  if(!success) {
    return NextResponse.json({ok: false, error: 'Слишком много запросов'}, {status:429})
  }
}
async function tokenMiddleware(req: NextRequest, responseWithCsp: NextResponse<unknown>) {
  const publicRoute = ['/auth/login', '/auth/register', '/recovery']
  const secureRoute = ['/settings']
  const adminsRoute = ['/adminsPanel']
  const cookieStorage = await cookies();
  const tokenHas = cookieStorage.has('token')
  const dIdHas = cookieStorage.has('dId')
  if(!tokenHas && secureRoute.some(route=>req.nextUrl.pathname.startsWith(route)) || !tokenHas && adminsRoute.some(route=>req.nextUrl.pathname.startsWith(route))){
    return NextResponse.redirect(new URL('/', req.url))
  }
  if(!tokenHas && !dIdHas){
    return responseWithCsp
  }
  if(tokenHas && !dIdHas){
    await prisma.devices.deleteMany({where:{token: cookieStorage.get('token')?.value}})
    await deleteToken(req)
    return NextResponse.redirect(new URL('/invalid', req.url))
  }
  if(tokenHas && publicRoute.includes(req.nextUrl.pathname)){
    return NextResponse.redirect(new URL('/', req.url))
  }

  const dId = cookieStorage.get('dId')!.value
  const token = cookieStorage.get('token')?.value
  if(!token){
    return responseWithCsp
  }
  const validateToken = validateJWT(token)
  const validateUser = await prisma.devices.findUnique({ where: { deviceId: dId } })
  if(!validateUser || !validateToken){
    await prisma.devices.deleteMany({where:{OR:[{ deviceId: dId} , {token:token}]}})
    cookieStorage.delete('dId')
    cookieStorage.delete('token')
    return NextResponse.redirect(new URL('/invalid', req.url))
  }
  if(typeof validateToken !== 'string'&&validateToken.role !=='Admin'&&adminsRoute.some(route=>req.nextUrl.pathname.startsWith(route))){
    return NextResponse.redirect(new URL('/', req.url))
  }
  return responseWithCsp
}
