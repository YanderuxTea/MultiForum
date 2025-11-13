import jwt from 'jsonwebtoken'
import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET;
export interface IPayload {
  id: string;
  login: string;
  role: string;
  email: string;
  verifyEmail: string;
  verifyAdm: string;
  deviceId: string;
  date: Date
}
export function generateJWT(payload: IPayload) {
  if(!JWT_SECRET){throw new Error('Нет JWT');}
  return jwt.sign(payload, JWT_SECRET,{expiresIn: '7d'});
}
export function validateJWT(token: string) {
  if(!JWT_SECRET){throw new Error('Нет JWT');}
  try {
    return jwt.verify(token, JWT_SECRET);
  }catch(err){
    return null;
  }
}
export async function deleteToken(req:Request){
  const cookieStore = await cookies()
  cookieStore.delete('token')
  return NextResponse.redirect(new URL('/',req.url))
}