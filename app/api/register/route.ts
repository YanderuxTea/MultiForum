import {z} from 'zod'
import {NextResponse} from 'next/server'
import {PrismaClient} from '@/app/generated/prisma'
import bcrypt from 'bcrypt'
import {randomBytes} from 'node:crypto'

const prisma = new PrismaClient()
const registerSchema = z.object({
  login: z.string().trim().min(6, 'Логин не может быть меньше 6 символов').max(25, 'Логин не может быть больше 25 символов').regex(/^[a-zA-Z0-9]+$/, 'Логин может содержать только латинские буквы и цифры'),
  password: z.string().trim().min(8, 'Пароль не может быть меньше 8 символов'),
  email: z.string().trim().regex(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, 'Некорректная почта')
});
export async function POST(req: Request){
  try {
    const body = await req.json();
    const validateData = registerSchema.safeParse(body)
    if(!validateData.success){
      return NextResponse.json({ok:false, error:z.flattenError(validateData.error)},{status:400});
    }
    const {login, password, email} = body;
    const existingUser = await prisma.users.findFirst({where:{OR:[{login: login.trim().toLowerCase()}, {email:email.trim().toLowerCase()}]}});
    if(existingUser){
      const field = existingUser.login === login.trim().toLowerCase() ?'Логин':'Почта'
      return NextResponse.json({ok:false, error:`${field} уже используется`},{status:400})
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const codeVerification = randomBytes(4).toString('hex')
    await prisma.users.create({
      data:{
        login:login.trim(),
        password:hashedPassword,
        email:email.trim(),
        verification:codeVerification
      }
    })
    return NextResponse.json({ok:true, message:'Успешно! Проверьте почту'},{status:201})
  }catch (error){
   console.log('Ошибка базы данных', error)
   return NextResponse.json({ok:false, error:'Внутренняя ошибка сервера'},{status:500})
  }finally{
    await prisma.$disconnect()
  }
}