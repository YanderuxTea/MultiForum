import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'
import {IUnbans} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'

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
  const loginAdmin = validToken.login
  const body = await req.json()
  const {selectBans, reason} = body
  const result =await Promise.all(selectBans.map(async (bans:IUnbans) => {
    return prisma.unbans.create({data:{idBan: bans.id, idUser:bans.idUser, admin:loginAdmin, reason:reason}})
  }))
  return NextResponse.json({ok: true, message: 'Успешно', result:result})
}