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
  const body = await req.json()
  const {id} = body
  if(typeof validToken !== 'string'){
    await prisma.$transaction(async (trx)=>{
      const user = await trx.users.update({where: {id: id}, data:{avatar:null, warns:{create:{reason:'Некорректный аватар', admin:validToken.login}}}, include:{warns:{include:{Unwarns:true}}}})
      const activeWarns = user.warns.filter(warn => {
        if(warn.Unwarns){
          return false
        }
        return warn
      }).length % 3
      if(activeWarns === 0){
        await trx.bans.create({data:{idUser: user.id, reason:'Накоплено 3 предупреждения', time:60, admin:validToken.login}})
      }
    })
  }
  return NextResponse.json({ok: true})
}