import {PrismaPg} from '@prisma/adapter-pg'
import {PrismaClient} from '.prisma/client'

const adapter = new PrismaPg({
  connectionString: process.env.DB_DATABASE_URL
});
const globalPrisma = global as unknown as { prisma: PrismaClient }
export const prisma = globalPrisma.prisma ?? new PrismaClient({adapter})
if(process.env.NODE_ENV !== 'production'){globalPrisma.prisma = prisma}