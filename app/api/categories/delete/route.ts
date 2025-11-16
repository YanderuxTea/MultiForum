import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {ICategories} from '@/context/CategoriesContext'
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
  const {selectCategories}: { selectCategories: ICategories[] } = body
  if(selectCategories.length===0){
    return NextResponse.json({ok: false, message: 'вы не выбрали категории'})
  }
  const positions = selectCategories.map(category => category.position)
  const lowestDeletedPosition = Math.min(...positions)
  const idsToDelete = selectCategories.map(category => category.id)
  await prisma.categories.deleteMany({where: {id: {in:idsToDelete}}})
  await prisma.categories.updateMany({where: {position:{gte:lowestDeletedPosition}}, data:{position:{decrement:selectCategories.length}}})
  return NextResponse.json({ok:true, message:'Успешно'})
}