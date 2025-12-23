import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'
import {cookies} from 'next/headers'
import {validateJWT} from '@/lib/jwt'

export async function GET(){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  const validToken = validateJWT(token?token.value:'')
  if(!token || !validToken || typeof validToken === 'string' || validToken.role === 'User'){
    const categories = await prisma.categories.findMany({where:{visible:{not:'Admin'}}, select:{id:true, position:true, title:true, visible:true,subCategories:{where:{visible:true},select:{position:true,id:true, title:true, idCategories:true, icon:true, change:true, visible:true,posts:{select:{id:true,title:true,idSubCategories:true, MessagesPosts:{select:{createdAt:true, Users:{select:{login:true, role:true, avatar:true}}}, orderBy:{createdAt:'desc'}, take:1}}, orderBy:{lastUpdate:'desc'}, take:1}, _count:{select:{posts:true}}}, orderBy:{position:'asc'}}}, orderBy:{position:'asc'}})
    return NextResponse.json({data:categories})
  }
  const categories = await prisma.categories.findMany({select:{id:true, title:true, position:true, visible:true,subCategories:{select:{position:true, id:true, title:true, idCategories:true, icon:true, change:true, visible:true,posts:{select:{id:true,title:true,idSubCategories:true, MessagesPosts:{select:{createdAt:true, Users:{select:{login:true, role:true, avatar:true}}}, orderBy:{createdAt:'desc'}, take:1}}, orderBy:{lastUpdate:'desc'}, take:1}, _count:{select:{posts:true}}}, orderBy:{position:'asc'}}}, orderBy:{position:'asc'}})
  return NextResponse.json({data:categories})
}