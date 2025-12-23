import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {generateJWT, generateTwoFactor, validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'
import {decryptSecret} from '@/app/api/twoFactor/generate/route'
import {authenticator} from 'otplib'

export async function POST(req:Request){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')?.value
  if (!token) {
    return NextResponse.json({ok: false, message: 'No token provided.'})
  }
  const validToken = validateJWT(token)
  if (typeof validToken === 'object' && validToken) {
    const body = await req.json()
    const {code} = body
    const id = validToken.id
    const user = await prisma.users.findUnique({where: {id: id}, select:{iv:true, encryptedData:true, authTag:true}})
    if(!user){
      return NextResponse.json({ok: false, message: 'No token provided.'})
    }else {
      const decryptedSecret = decryptSecret({iv:user.iv!, tag:user.authTag!, enc:user.encryptedData!})
      if (!decryptedSecret) {
        return NextResponse.json({ok: false, message: 'No token provided.'})
      }
      const isValid = authenticator.check(code, decryptedSecret)
      if (isValid) {
        const dId = cookieStorage.get('dId')?.value
        if(!dId){
          return NextResponse.json({ok: false, message: 'No token provided.'})
        }
        const newToken = generateJWT({id:validToken.id, login:validToken.login, role:validToken.role, email:validToken.email, verifyEmail:validToken.verifyEmail, verifyAdm:validToken.verifyAdm, deviceId:dId, date:new Date(), isTwoFactor:true});
        const twoFactor = generateTwoFactor({deviceId:dId, date:new Date(), confirm:true})
        cookieStorage.set({name:'2fa', value:twoFactor, secure: process.env.NODE_ENV === 'production', sameSite:'strict', httpOnly:true, maxAge:60*60*24*7, path:'/'})
        cookieStorage.set({name:'token',value:newToken, httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'strict', maxAge:60*60*24*7, path:'/'})
        await prisma.devices.update({where:{deviceId:dId},data:{token:newToken}})
        await prisma.users.update({where:{id:id}, data:{isTwoFactorEnabled:true}})
        await prisma.devices.deleteMany({where:{deviceId:{not:dId},userId:validToken.id}})
        return NextResponse.json({ok: true, message: 'Успешно!'})
      }else {
        return NextResponse.json({ok: false, message: 'неверный код из приложения'})
      }
    }
  }else {
    return NextResponse.json({ok: false, message: 'No token provided.'})
  }
}