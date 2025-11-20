import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateTwoFactor} from '@/lib/jwt'

export async function GET(){
  const cookieStore = await cookies()
  const twoFactor = cookieStore.get('2fa')?.value
  if(twoFactor){
    const validateTokenTwoFactor = validateTwoFactor(twoFactor)
    if(typeof validateTokenTwoFactor === 'object'){
      return NextResponse.json({isEnabled:true, data:validateTokenTwoFactor})
    }
  }else {
    return NextResponse.json({isEnabled:false})
  }
}