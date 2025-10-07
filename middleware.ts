import {Redis} from '@upstash/redis'
import {Ratelimit} from '@upstash/ratelimit'
import {NextResponse} from 'next/server'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
const rateLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, '10 s')
})
export async function middleware(req: Request) {
  const ip =  req.headers.get('x-forwarded-for')??'anonymous'
  const { success } = await rateLimiter.limit(ip)
  if(!success) {
    return NextResponse.json({ok: false, error: 'Слишком много запросов'})
  }
  return NextResponse.next()
}
export const config = {
  matcher: ['/api/login', '/api/register'],
};