import {prisma} from '@/lib/prisma'
import {NextResponse} from 'next/server'

export async function GET(){
    const categories = await prisma.categories.findMany({include:{subCategories:true}, orderBy:{position:'asc'}});
    return NextResponse.json({data:categories})
}