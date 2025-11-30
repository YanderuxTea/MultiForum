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
  const {title, selectIcon, id} = body
  if(!title || !selectIcon || !id){
    return NextResponse.json({ok: false, message: 'Вы не выбрали иконку или не вписали название'})
  }
  const lastPosition = await prisma.subCategories.findFirst({orderBy:{position:'desc'},select:{position:true}})
  const subCategories = await prisma.subCategories.create({data:{title:title, idCategories:id, icon:selectIcon, position:lastPosition?lastPosition.position+1:1}, include:{posts:{include:{user:{select:{login:true, avatar:true, role:true}}}}, _count:{select:{posts:true}}}})
  return NextResponse.json({ok:true, message:'Успешно', sub:subCategories})
}