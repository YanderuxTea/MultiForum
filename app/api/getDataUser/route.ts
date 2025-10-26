import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'


export async function GET(){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  const dId = cookieStorage.get('dId')
  if(!token || !dId){
    return NextResponse.json({user:null})
  }
  const validateToken = validateJWT(token.value)
  const user = await prisma.devices.findUnique({where:{deviceId:dId.value}})
  if(!user){
    cookieStorage.delete('token')
    cookieStorage.delete('dId')
    return NextResponse.json({user:null})
  }
  return NextResponse.json({user:validateToken})
}