import {JSONContent} from '@tiptap/core'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'
import {rateLimiterCreateAnswer} from '@/proxy'

export async function POST(req: Request){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  if(!token){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }
  const validToken = validateJWT(token.value)
  if(!validToken || typeof validToken === 'string'){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }
  if(validToken.role === 'User'){
    const res = await rateLimiterCreateAnswer(req)
    if(res){
      return res
    }
  }
  const body = await req.json()
  const {data, id, idUser, beforeText}:{data:JSONContent, id:string, idUser:string, beforeText:JSONContent} = body
  if(validToken.id !== idUser){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }
  await prisma.messagesPosts.update({where:{id:id}, data:{text:data}})
  const history = await prisma.historyMessage.create({data:{afterText:data, beforeText:beforeText, idMessage:id, idUser:validToken.id}, select:{updateAt:true}})
  return NextResponse.json({ok:true, history:history}, {status:200})
}