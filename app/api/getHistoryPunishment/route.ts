import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {prisma} from '@/lib/prisma'

export async function GET(){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')?.value
  const dId = cookieStorage.get('dId')?.value
  if(!token || !dId){
    return NextResponse.json({ok: false})
  }
  const validToken = validateJWT(token)
  if(!validToken || typeof validToken === 'string'){
    return NextResponse.json({ok: false})
  }
  const user = await prisma.users.findUnique({where: {id: validToken.id.toString()}, select:{bans:{include:{Unbans:true}, orderBy:{date:'desc'}}, warns:{include:{Unwarns:true}, orderBy:{date:'desc'}}}})
  if (!user){
    return NextResponse.json({ok: true, user: user})
  }
  const combinedPunishments = [
    ...user.bans,
    ...user.warns,
  ]
  combinedPunishments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  return NextResponse.json({ok: true, user:combinedPunishments})
}