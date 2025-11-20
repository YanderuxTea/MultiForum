import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'

export async function GET(){
    const categories = await prisma.categories.findMany({include:{subCategories:{include:{posts:{take:1,include:{user:{select:{login:true, avatar:true, role:true}}}, orderBy:{createdAt:'desc'}}, _count:{select:{posts:true}}}}}, orderBy:{position:'asc'}});
    return NextResponse.json({data:categories})
}