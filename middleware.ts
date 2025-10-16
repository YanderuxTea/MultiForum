import {Redis} from '@upstash/redis'
import {Ratelimit} from '@upstash/ratelimit'
import {NextRequest, NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import {deleteToken, validateJWT} from '@/lib/jwt'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s')
})
const rateLimitRecovery = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, '1 h')
})
export async function middleware(req:NextRequest) {
  const url = req.nextUrl.pathname;
  if(url === '/api/login'||url === '/api/register' || url === '/api/verifyEmail' || url === '/api/sendRecoveryCode'|| url === '/api/confirmRecoveryCode' || url === '/api/changeAvatar') {
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
  const tokenResponse = await tokenMiddleware(req)
  if(tokenResponse){
    return tokenResponse
  }
  return NextResponse.next()
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
async function tokenMiddleware(req: NextRequest){
  const publicRoute = ['/auth/login', '/auth/register', '/recovery']
  const cookieStorage = await cookies();
  const token = cookieStorage.get('token')

  if(!token){
    return NextResponse.next()
  }
  const validatedToken = validateJWT(token.value)
  if(!validatedToken){
    await deleteToken(req)
  }
  if (validatedToken && publicRoute.includes(req.nextUrl.pathname)){
    return NextResponse.redirect(new URL('/',req.url))
  }
}
export const config = {
  runtime: 'nodejs'
}