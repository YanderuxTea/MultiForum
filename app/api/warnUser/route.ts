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
  if(typeof validToken === 'object'){
    const checkStaff = validToken.role === 'Admin' || validToken.role === 'Moderator'
    if(!checkStaff){
      return NextResponse.json({ok: false, message: 'No permission to access.'})
    }
  }
  if(typeof validToken === 'string'){
    return NextResponse.json({ok: false, message: 'No token provided.'})
  }
  const loginAdmin = validToken.login
  const body = await req.json()
  const {count, reason, id} = body
  const warns = await prisma.warns.findMany({where:{idUser:id, Unwarns:null}})
  const warnsCount = Math.floor((count + (warns.length%3))/3)
  const timeBan = warnsCount*60
  const creationPromises = []
  for(let i = 0; i <count; i++){
    creationPromises.push(prisma.warns.create({data:{idUser:id, reason:reason, admin: loginAdmin}}))
  }
  if (timeBan > 0) {
    creationPromises.push(
      prisma.bans.create({
        data: { idUser: id, reason: reason, admin: loginAdmin, time: timeBan }
      })
    )
  }
  const results = await Promise.all(creationPromises)
  const createdWarns = results.slice(0, count)
  const createdBan = (timeBan>0)?results[results.length-1] : null
  return NextResponse.json({ok:true, message:'Успешно', createdWarns:createdWarns, createdBan:createdBan})
}