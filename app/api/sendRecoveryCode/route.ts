import {z} from 'zod'

import {NextResponse} from 'next/server'
import {randomBytes} from 'node:crypto'
import nodemailer from 'nodemailer'
import {prisma} from '@/lib/prisma'

const emailSchema = z.object({
  email: z.string().trim().regex(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/)
})
export async function POST(req: Request){
  const body = await req.json();
  const validateData = emailSchema.safeParse(body);
  if(!validateData.success){
    return NextResponse.json({ok:false, error:'Некорректная почта'})
  }
  try {
    const user = await prisma.users.findUnique({where:{email:validateData.data.email}, select:{recoveryCode:true, dateRecoveryCode:true}});
    if(!user){
      return NextResponse.json({ok:false, error:'Некорректная почта'})
    }
    const code = randomBytes(8).toString('hex')
    await prisma.users.update({where:{email:validateData.data.email}, data:{recoveryCode:code, dateRecoveryCode:new Date()}});
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port:465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    })
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: validateData.data.email,
      subject: 'Код для сброса пароля',
      text: `Ваш код для сброса пароля: ${code}`,
    })
    return NextResponse.json({ok:true})
  }catch(err){
    console.log(err)
    return NextResponse.json({ok:false,error:'Неизвестная ошибка'})
  }
}