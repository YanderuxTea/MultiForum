import {z} from 'zod'
import {NextResponse} from 'next/server'
import bcrypt from 'bcrypt'
import nodemailer from 'nodemailer'
import {randomBytes} from 'node:crypto'
import {prisma} from '@/lib/prisma'

const registerSchema = z.object({
  login: z.string().trim().min(6, 'Логин не может быть меньше 6 символов').max(25, 'Логин не может быть больше 25 символов').regex(/^[a-zA-Z0-9]+$/, 'Логин может содержать только латинские буквы и цифры'),
  password: z.string().trim().min(8,'Пароль не может быть меньше 8 символов'),
  email: z.string().trim().regex(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, 'Некорректная почта')
})
export async function POST(req:Request){
  const body = await req.json();
  const validateData = registerSchema.safeParse(body);
  if(!validateData.success){
    return NextResponse.json({ok:false, error:z.flattenError(validateData.error)}, {status:400})
  }
  const {login, password, email} = validateData.data;
  const existingUser = await prisma.users.findFirst({where:{OR:[{login:{equals:login, mode:'insensitive'}},{email:email}]}});
  if(existingUser){
    const field = existingUser.login.toLowerCase() === login.toLowerCase() ? 'Логин': 'Почта'
    return NextResponse.json({ok:false, error:`${field} уже используется`})
  }
  const hashedPassword = await bcrypt.hash(password, 12);
  const code = randomBytes(4).toString('hex');
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  })
  try {
    await transporter.sendMail({
      from: `"Multi Forum" <${process.env.SMTP_USER}>`,
      to: email.trim(),
      subject: 'Код подтверждения',
      text: `Ваш код подтверждения: ${code}`
    })
  }catch(err){
    console.log(err)
  }
  try {
    await prisma.users.create({
      data: {
        login: login.trim(),
        password: hashedPassword,
        email: email.trim(),
        verification: code
      }
    })
  }catch(err){
    console.log(err)
    return NextResponse.json({ok:false, error:'Внутренняя ошибка сервера'})
  }
  return NextResponse.json({ok:true, message:'Успешно! Проверьте почту'})
}