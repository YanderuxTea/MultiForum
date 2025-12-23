import {JSONContent} from '@tiptap/core'
import {NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'
import {cookies} from 'next/headers'
import {validateJWT} from '@/lib/jwt'
import {rateLimiterCreateAnswer} from '@/proxy'

export async function POST(req:Request){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  if(!token){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }
  const validToken = validateJWT(token.value)
  if(!validToken || typeof validToken === 'string'){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }
  if(validToken.role === 'User'){
    const res = await rateLimiterCreateAnswer(req)
    if(res){
      return res
    }
  }
  const body = await req.json()
  const {themeId, data, subCategoryId}:{themeId:string, data:JSONContent, subCategoryId:string} = body
  if(!themeId || !data || !subCategoryId){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }
  const checkSubCategory = await prisma.subCategories.findUnique({where:{id:subCategoryId}, select:{visible:true}})
  if(!checkSubCategory){
    return NextResponse.json({ok:false, error:'неизвестная ошибка'})
  }else if(!checkSubCategory.visible){
    if(validToken.role === 'User'){
      return NextResponse.json({ok:false, error:'неизвестная ошибка'})
    }
    const checkTheme = await prisma.posts.findUnique({where:{id:themeId}, select:{locked:true}})
    if(!checkTheme){
      return NextResponse.json({ok:false, error:'неизвестная ошибка'})
    }else if(checkTheme.locked){
      return NextResponse.json({ok:false, error:'тема закрыта'})
    }
    const message = await prisma.messagesPosts.create({data:{idPosts:themeId, idUser:validToken.id, text:data}, select:{id:true,createdAt:true,idUser:true,text:true,idPosts:true,Users:{select:{login:true, avatar:true, role:true, _count:{select:{MessagesPosts:true}}}},HistoryMessage:{select:{updateAt:true}, orderBy:{updateAt:'desc'},take:1}, Posts:{select:{title:true,user:{select:{login:true,avatar:true,role:true}},locked:true,createdAt:true, _count:{select:{MessagesPosts:true}}}}}})
    await prisma.posts.update({where:{id:themeId}, data:{lastUpdate:new Date(Date.now())}})
    return NextResponse.json({ok:true, data:message})
  }else if(checkSubCategory.visible){
    const checkTheme = await prisma.posts.findUnique({where:{id:themeId}, select:{locked:true}})
    if(!checkTheme){
      return NextResponse.json({ok:false, error:'неизвестная ошибка'})
    }else if(checkTheme.locked){
      return NextResponse.json({ok:false, error:'тема закрыта'})
    }
    const message = await prisma.messagesPosts.create({data:{idPosts:themeId, idUser:validToken.id, text:data}, select:{id:true,createdAt:true,idUser:true,text:true,idPosts:true,Users:{select:{login:true, avatar:true, role:true, _count:{select:{MessagesPosts:true}}}},HistoryMessage:{select:{updateAt:true}, orderBy:{updateAt:'desc'},take:1}, Posts:{select:{title:true,user:{select:{login:true,avatar:true,role:true}},locked:true,createdAt:true, _count:{select:{MessagesPosts:true}}}}}})
    await prisma.posts.update({where:{id:themeId}, data:{lastUpdate:new Date(Date.now())}})
    return NextResponse.json({ok:true, data:message})
  }
}