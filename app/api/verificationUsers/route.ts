import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

export async function POST(req: Request){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  if(!token){
    return NextResponse.json({ok: false, message: 'No token provided.'})
  }
  const validToken = validateJWT(token.value)
  if(!validToken){
    return NextResponse.json({ok: false, message: 'No token provided.'})
  }
  if(typeof validToken === 'object' && validToken.role !== 'Admin'){
    return NextResponse.json({ok: false, message: 'No permission to access.'})
  }
  const body = await req.json()
  const {id, type} = body
  if(type === 'verify'){
    await prisma.users.update({where:{id:id}, data:{verificationAdm:'Yes'}})
    await prisma.devices.deleteMany({where:{userId:id}})
  }else if(type === 'delete'){
    await prisma.users.delete({where:{id:id}})
  }
  return NextResponse.json({ok: true})
}