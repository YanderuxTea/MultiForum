import {z} from 'zod'
import {NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'
import {cookies} from 'next/headers'
import {validateJWT} from '@/lib/jwt'

const avatarSchema = z.object({
  url: z.string().trim().refine((val) => val === '' || /^https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(gif|png|jpe?g)$/i.test(val), 'Некорректная ссылка на аватарку'),
})
export async function POST(req: Request){
  const body = await req.json()
  const validateData=avatarSchema.safeParse(body)
  if(!validateData.success){
    return NextResponse.json({ok:false, issues: validateData.error.issues})
  }
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  if(!token){
    return NextResponse.json({ok:false, error:'Ошибка'})
  }
  const dataUser = validateJWT(token.value)
  try {
    if(typeof dataUser === 'object' && dataUser !== null){
      await prisma.users.update({where:{login:dataUser.login}, data:{avatar:validateData.data.url === ''?null:validateData.data.url}})
      return NextResponse.json({ok:true, message:'Успешно!'})
    }
  }catch(err){
    return NextResponse.json({ok:false, error:err})
  }
}