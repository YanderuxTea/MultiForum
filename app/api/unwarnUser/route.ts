import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {IWarns} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'
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
  if(typeof validToken === 'string'){
    return NextResponse.json({ok: false, message: 'No token provided.'})
  }
  const body = await req.json()
  const {selectWarns, reason} = body
  const loginAdmin = validToken.login
  const result = await Promise.all(selectWarns.map(async (warns:IWarns)=>{
    return prisma.unwarns.create({data:{idWarn:warns.id, admin:loginAdmin, reason:reason, idUser:warns.idUser}})
  }))
  return NextResponse.json({ok: true, message: 'Успешно', result:result})
}