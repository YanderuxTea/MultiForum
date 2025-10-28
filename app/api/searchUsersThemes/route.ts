import {NextResponse} from 'next/server'
import {prisma} from '@/lib/prisma'

export async function POST(req:Request){
  // const res = await rateLimiterSearch(req)
  // if(res){
  //   return res
  // }
  const body = await req.json()
  const {query, searchParams} = body
  if(!query.toString().trim() || !searchParams.toString().trim()){
    return NextResponse.json({ok:false})
  }
  if(searchParams.toString().trim()==='All'||searchParams.toString().trim()==='User'){
    const users = await prisma.users.findMany({where:{login:{contains:query.toString().trim(), mode:'insensitive'}}, select:{login:true, avatar:true, role:true}})
    return NextResponse.json({ok:true, data:users})
  }else if(searchParams.toString().trim()==='Themes'){
    return NextResponse.json({ok:true, data:[]})
  }
}