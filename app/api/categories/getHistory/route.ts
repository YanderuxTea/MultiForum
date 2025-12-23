import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

export async function POST(req:Request){
  const body = await req.json()
  const pageSize = 5
  const {id, pageNumber}:{id:string, pageNumber:number} = body
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  if(!token || !id){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }
  const validToken = validateJWT(token.value)
  if(!validToken || typeof validToken === 'string'){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }
  if(validToken.role === 'User'){
    return NextResponse.json({ok:false, error:'недостаточно прав'})
  }
  const history = await prisma.messagesPosts.findUnique({where:{id:id}, select:{HistoryMessage:{orderBy:{updateAt:'desc'}, take:pageSize, skip:pageSize*pageNumber},_count:{select:{HistoryMessage:true}}}})
  return NextResponse.json({ok:true, data:history})
}