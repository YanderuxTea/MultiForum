import {z} from 'zod'
import {NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'

const confirmRecoveryCodeSchema = z.object({
  email: z.string().trim().regex(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/),
  code: z.string().trim().regex(/^[A-Fa-f0-9]+$/).length(16)
})
export async function POST(req:Request){
  const body = await req.json();
  const validateData = confirmRecoveryCodeSchema.safeParse(body);
  if(!validateData.success){
    return NextResponse.json({ok:false, error:'Неверный код'})
  }
  try {
    const user = await prisma.users.findUnique({where:{email:validateData.data.email}, select:{recoveryCode:true, dateRecoveryCode:true}})
    if(!user){
      return NextResponse.json({ok:false, error:'Неизвестная ошибка'})
    }
    if(user.recoveryCode !== validateData.data.code){
      return NextResponse.json({ok:false,error:'Неверный код'})
    }
    if(!user.dateRecoveryCode){
      return NextResponse.json({ok:false, error: 'Неизвестная ошибка'})
    }
    const diffMs = new Date().getTime() - user.dateRecoveryCode.getTime()
    const diffH = diffMs / (1000*60*60)
    if(diffH > 1){
      await prisma.users.update({where:{email:validateData.data.email},data:{recoveryCode:null, dateRecoveryCode:null}})
      return NextResponse.json({ok:false, error:'Неизвестная ошибка'})
    }
    if(user.recoveryCode === validateData.data.code){
      return NextResponse.json({ok:true})
    }
  }catch(err){
    console.log(err)
    return NextResponse.json({ok:false, error:'Неизвестная ошибка'})
  }
}