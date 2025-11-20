import {cookies} from 'next/headers'
import {NextResponse} from 'next/server'
import {validateJWT} from '@/lib/jwt'
import {authenticator} from 'otplib'
import QRCode from 'qrcode'
import {prisma} from '@/lib/prisma'
import crypto from 'crypto'

export function encryptSecret(secret: string) {
  const iv = crypto.randomBytes(12)
  const encKey = process.env.ENC_KEY;
  if(encKey){
    const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(encKey, 'base64'), iv);
    const encrypted = Buffer.concat([cipher.update(secret, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag()
    return {
      encryptedData: encrypted.toString('base64'),
      iv: iv.toString('base64'),
      authTag: tag.toString('base64'),
    };
  }
}
export function decryptSecret({enc, iv, tag}:{enc:string, iv:string, tag:string}){
  const encKey = process.env.ENC_KEY;
  if(encKey){
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(encKey, 'base64'), Buffer.from(iv, 'base64'));
    decipher.setAuthTag(Buffer.from(tag, 'base64'));
    const decryptedData = Buffer.concat([
      decipher.update(Buffer.from(enc, 'base64')),
      decipher.final()
    ])
    return decryptedData.toString('utf-8');
  }
}
export async function GET(){
  const cookieStorage = await cookies()
  const token = cookieStorage.get('token')?.value
  if (!token) {
    return NextResponse.json({ok: false, message: 'No token provided.'})
  }
  const validToken = validateJWT(token)
  if (typeof validToken === 'object' && validToken) {
    const login = validToken.login
    const id = validToken.id
    const secret = authenticator.generateSecret()
    const otpauth = authenticator.keyuri(
      login,
      'Multi Forum',
      secret
    )
    const encSecret = encryptSecret(secret)
    if(encSecret){
      const qr = await QRCode.toDataURL(otpauth)
      await prisma.users.update({where:{id:id}, data:{encryptedData:encSecret.encryptedData, iv:encSecret.iv, authTag:encSecret.authTag}});
      return NextResponse.json({ok: true, qr:qr, secret:secret})
    }
  }else {
    return NextResponse.json({ok: false, message: 'No token provided.'})
  }
}