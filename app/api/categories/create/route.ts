import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

export async function POST(req:Request){
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
  const {title} = body
  if(!title){
    return NextResponse.json({ok: false, message: 'вы не ввели название'})
  }else {
    const latestCategory = await prisma.categories.findFirst({
      orderBy:{
        position:'desc',
      },
      select:{
        position:true
      }
    })
    const categories=await prisma.categories.create({data:{title:title, position:latestCategory?latestCategory.position +1 : 1}, include:{subCategories:true}})
    return NextResponse.json({ok:true,data:categories, message:'Успешно'})
  }
}