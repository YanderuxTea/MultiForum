import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

export async function POST(req:Request){
  const body = await req.json()
  if(!body){
    return NextResponse.json({ok:false, error:'Неизвестная ошибка'})
  }
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  const dId = cookieStorage.get('dId')
  if (!token || !dId) {
    return NextResponse.json({ok: false, status: 404}, {status: 404})
  }
  const validToken = validateJWT(token.value)
  if (!validToken) {
    return NextResponse.json({ok: false, status: 404}, {status: 404})
  }
  if (dId === body.dId) {
    return NextResponse.json({ok: false, error: 'Неизвестная ошибка'})
  }
  try {
    await prisma.devices.delete({where:{id:body.id}})
    return NextResponse.json({ok: true}, {status:201})
  }catch(err){
    console.log(err)
    return NextResponse.json({ok: false, error:'Неизвестная ошибка'})
  }
}