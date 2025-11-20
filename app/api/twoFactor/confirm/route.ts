import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {generateTwoFactor, validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'
import {decryptSecret} from '@/app/api/twoFactor/generate/route'
import {authenticator} from 'otplib'

export async function POST(req: Request){
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
        const twoFactor = generateTwoFactor({deviceId:dId, date:new Date(), confirm:true})
        cookieStorage.set({name:'2fa', value:twoFactor, secure: process.env.NODE_ENV === 'production', sameSite:'strict', httpOnly:true, maxAge:60*60*24*7, path:'/'})
        return NextResponse.json({ok: true, message: 'Добро пожаловать'})
      }else {
        return NextResponse.json({ok: false, message: 'неверный код из приложения'})
      }
    }
  }else {
    return NextResponse.json({ok: false, message: 'No token provided.'})
  }
}