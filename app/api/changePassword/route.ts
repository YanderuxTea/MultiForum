import {z} from 'zod'
import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'
import bcrypt from 'bcrypt'

const changePassChem = z.object({
  currentPassword: z.string().min(8, 'Некорректный пароль').trim(),
  newPassword: z.string().min(8, 'Длина пароля не может быть меньше 8 символов').trim(),
})
export async function POST(req:Request){
  const body = await req.json()
  const validateData = changePassChem.safeParse(body)
  if(!validateData.success){
    return NextResponse.json({ok:false, issues:validateData.error.issues}, {status:400})
  }else {
    const cookieStorage = await cookies()
    const token = cookieStorage.get('token')
    if(!token){
      return NextResponse.json({ok:false, status:404}, {status:404})
    }
    const validToken = validateJWT(token.value)
    if(!validToken){
      return NextResponse.json({ok:false, status:404}, {status:404})
    }
    if(typeof validToken === 'object'){
      const user = await prisma.users.findUnique({where:{id:validToken.id}})
      if(!user){
        return NextResponse.json({ok:false, status:404}, {status:404})
      }
      const checkPass = await bcrypt.compare(validateData.data.currentPassword, user.password)
      if(!checkPass){
        return NextResponse.json({ok:false, error:'Неверный пароль'}, {status:400})
      }
      const newPass = await bcrypt.hash(validateData.data.newPassword, 12)
      await prisma.users.update({where:{id:validToken.id},data:{password:newPass}})
      return NextResponse.json({ok:true, message:'Успешно'},{status:200})
    }
  }
}