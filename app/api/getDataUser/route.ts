import {cookies} from 'next/headers'
import {validateJWT} from '@/lib/jwt'
import {NextResponse} from 'next/server'

export async function GET(){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')
  if(token){
    const validateToken = validateJWT(token.value)
    if(validateToken){
      return NextResponse.json({user:validateToken})
    }
  }
  return NextResponse.json({ user: null })
}