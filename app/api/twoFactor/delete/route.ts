import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {generateJWT, validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

export async function GET(){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')?.value
  if (!token) {
    return NextResponse.json({ok: false, message: 'No token provided.'})
  }
  const validToken = validateJWT(token)
  if (typeof validToken === 'object' && validToken) {
    const dId = cookieStorage.get('dId')?.value
    if(!dId){
      return NextResponse.json({ok: false, message: 'No token provided.'})
    }
    const newToken = generateJWT({id:validToken.id, login:validToken.login, role:validToken.role, email:validToken.email, verifyEmail:validToken.verifyEmail, verifyAdm:validToken.verifyAdm, deviceId:dId, date:new Date(), isTwoFactor:false});
    cookieStorage.delete('2fa')
    cookieStorage.set({name:'token',value:newToken, httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'strict', maxAge:60*60*24*7, path:'/'})
    await prisma.devices.update({where:{deviceId:dId},data:{token:newToken}})
    await prisma.users.update({where:{id:validToken.id}, data:{encryptedData:null, iv:null, authTag:null, isTwoFactorEnabled:false}})
    await prisma.devices.deleteMany({where:{deviceId:{not:dId},userId:validToken.id}})
    return NextResponse.json({ok:true, message:'Успешно'})
  }
}