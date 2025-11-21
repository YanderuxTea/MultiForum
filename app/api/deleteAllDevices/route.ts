import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

export async function GET(){
  const cookieStore = await cookies()
  const token = cookieStore.get('token')?.value
  const dId = cookieStore.get('dId')?.value
  if(!dId || !token){
    return NextResponse.json({ok: false, error: 'No token provided.'})
  }
  const validToken = validateJWT(token)
  if(!validToken || typeof validToken === 'string'){
    return NextResponse.json({ok: false, error: 'No token provided.'})
  }
  await prisma.devices.deleteMany({where: {deviceId: {not:dId}, userId:validToken.id}})
  return NextResponse.json({ok: true, message: 'Успешно', dId:dId})
}