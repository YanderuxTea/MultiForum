import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import {prisma} from '@/lib/prisma'
import {validateJWT} from '@/lib/jwt'

export async function GET(){
  const cookieStore = await cookies()
  const token = cookieStore.get('token')
  if(token){
    const validToken = validateJWT(token.value)
    if(typeof validToken === 'object' && validToken){
      await prisma.devices.delete({where:{deviceId:validToken.deviceId}})
      cookieStore.delete('token')
      cookieStore.delete('2fa')
      return NextResponse.json({ok:true})
    }else {
      cookieStore.delete('token')
      cookieStore.delete('2fa')
      return NextResponse.json({ok:false})
    }
  }else {
    return NextResponse.json({ok:false, status:404},{status:404})
  }
}