import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt.ts'
import {prisma} from '@/lib/prisma.ts'

export async function POST(req:Request){
  const body = await req.json();
  const {id, pin}:{id:string, pin:boolean} = body;
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  if(!token){
    return NextResponse.json({ok: false, error: "неизвестная ошибка"})
  }
  const validToken = validateJWT(token.value)
  if(!validToken || typeof validToken === 'string'){
    return NextResponse.json({ok: false, error: "неизвестная ошибка"})
  }
  if(validToken.role !== 'Admin'){
    return NextResponse.json({ok: false, error: "неизвестная ошибка"})
  }
  await prisma.posts.update({where:{id:id}, data:{pinned:pin}})
  return NextResponse.json({ok: true})
}