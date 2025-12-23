import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

export async function POST(req:Request){
  const body = await req.json();
  const {locked, themeId}:{locked:boolean, themeId:string} = body;
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  if(!token){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }
  const validToken = validateJWT(token.value)
  if(!validToken || typeof validToken === 'string'){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }
  if (validToken.role === 'User'){
    return NextResponse.json({ok:false, error:'недостаточно прав'})
  }
  await prisma.posts.update({where:{id:themeId}, data:{locked:!locked, lastUpdate:new Date(Date.now())}})
  return NextResponse.json({ok:true})
}