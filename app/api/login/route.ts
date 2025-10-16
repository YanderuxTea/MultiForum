import {z} from 'zod'
import {NextResponse} from 'next/server'
import bcrypt from 'bcrypt'
import {cookies} from 'next/headers'
import {generateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

const loginSchema = z.object({
  login: z.string().min(6).max(25).trim().regex(/^[a-zA-Z0-9]+$/),
  password: z.string().min(8)
})
export async function POST(req:Request){
  const body = await req.json();
  const validateData = loginSchema.safeParse(body);
  const cookieStore = await cookies()
  if(!validateData.success){
    return NextResponse.json({ok:false, error:'Неверный логин или пароль'}, {status:401});
  }
  const {login, password} = validateData.data;
  try {
    const user = await prisma.users.findUnique({where: {login: login}});
    if(!user){
      return NextResponse.json({ok:false, error:'Неверный логин или пароль'})
    }
    const validatePassword = await bcrypt.compare(password, user.password)
    if(!validatePassword){
      return NextResponse.json({ok:false, error:'Неверный логин или пароль'})
    }
    const token = generateJWT({id:user.id, login:user.login, role:user.role, email:user.email, verifyEmail:user.verification, verifyAdm:user.verificationAdm});
    cookieStore.set({name: 'token', value: token, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', httpOnly:true, maxAge: 60 * 60 * 24 * 7, path: '/',})
    return NextResponse.json({ok:true, message:'Добро пожаловать!'})
  }catch(err){
    console.log(err)
    return NextResponse.json({ok:false, error:'Внутренняя ошибка сервера'})
  }
}