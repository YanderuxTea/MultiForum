import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

export async function GET(){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')?.value
  const dId = cookieStorage.get('dId')?.value
  if(!token || !dId){
    return NextResponse.json({ok: false})
  }
  const validToken = validateJWT(token)
  if(!validToken || typeof validToken === 'string'){
    return NextResponse.json({ok: false})
  }
  const devices = await prisma.users.findUnique({where:{id:validToken.id}, select:{devices:{select:{id:true, deviceType:true, deviceId:true}}}})
  if(!devices){
    return NextResponse.json({ok: false})
  }
  return NextResponse.json({ok: true, devices: devices, dId:dId})
}