import {cookies} from 'next/headers'
import {generateJWT, validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'

export async function GET(){
  const cookieStorage = await cookies();
  const token = cookieStorage.get('token')?.value
  const dId = cookieStorage.get('dId')?.value
  if(!token || !dId){
    return NextResponse.json({ok:false, status:404},{status:404})
  }
  const validateToken = validateJWT(token)
  if(typeof validateToken === 'object' && validateToken){
    const userData = await prisma.users.findUnique({where:{login:validateToken.login}, select:{id:true, login:true, role:true, email:true, verification:true, verificationAdm:true, isTwoFactorEnabled:true}})
    if(userData){
      const isSame = userData.id === validateToken.id&&
        userData.login === validateToken.login &&
        userData.role === validateToken.role&&
        userData.email === validateToken.email &&
        userData.verification === validateToken.verifyEmail&&
        userData.verificationAdm === validateToken.verifyAdm&&
        dId === validateToken.deviceId

      if(isSame){
        return NextResponse.json({ok:true, message:'Успешно'})
      }else {
        const newToken = generateJWT({id:userData.id, login:userData.login, role:userData.role, email:userData.email, verifyEmail:userData.verification, verifyAdm:userData.verificationAdm, deviceId:dId, date:new Date(), isTwoFactor:userData.isTwoFactorEnabled});
        cookieStorage.set({name:'token',value:newToken, httpOnly:true, secure:process.env.NODE_ENV==='production', sameSite:'strict', maxAge:60*60*24*7, path:'/'})
        await prisma.devices.update({where:{deviceId:dId},data:{token:newToken}})
        return NextResponse.json({ok:true, message:'Успешно'})
      }
    }else{
      return NextResponse.json({ok:false, error:'Перезайдите в аккаунт'})
    }
  }else {
    return NextResponse.json({ok:false, error:'Перезайдите в аккаунт'})
  }
}