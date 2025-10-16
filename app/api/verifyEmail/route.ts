import {z} from 'zod'

import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import {generateJWT, validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

const codeSchema = z.object({code:z.string().trim().length(8).regex(/^[A-Fa-f0-9]+$/)})
export async function POST(req:Request){
  const body = await req.json()
  const validateData = codeSchema.safeParse(body)
  if(!validateData.success){
    return NextResponse.json({ok:false, error:'Введите корректный код'})
  }
  const cookieStorage = await cookies();
  const token = cookieStorage.get('token')
  if(!token){
    return NextResponse.json({ok:false, error:'Неверный токен'})
  }
  const verifiedToken = validateJWT(token.value)
  if(typeof verifiedToken === 'object' && verifiedToken !== null){
    const user = await prisma.users.findUnique({where:{email:verifiedToken.email}})
    if(user!==null&&user.verification !== validateData.data.code){
      return NextResponse.json({ok:false, error:'Неверный код'})
    }
    try {
      await prisma.users.update({where:{email:verifiedToken.email}, data:{verification:'Verify'}})
      if(user!==null){
        const newToken = generateJWT({id:user.id, login:user.login, role:user.role, email:user.email, verifyEmail:'Verify', verifyAdm:user.verificationAdm})
        cookieStorage.set('token', newToken)
      }
      return NextResponse.json({ok:true, message:'Успешно! Ожидайте подтверждения Администратора'})
    }catch (err){
      console.log(err)
      return NextResponse.json({ok:false, error:'Ошибка сервера'})
    }
  }
}