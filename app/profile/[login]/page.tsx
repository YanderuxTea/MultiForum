import Profile from '@/components/ui/Profile'
import {notFound} from 'next/navigation'
import {prisma} from '@/lib/prisma'
import ChoosePhotoProvider from '@/components/providers/ChoosePhotoProvider'
import StubHeader from '@/components/shared/StubHeader'
import StubUnderHeader from '@/components/shared/StubUnderHeader'

export default async function Page({params}:{params:Promise<{login: string}>}) {
  const {login} = await params
  const data = await prisma.users.findUnique({where:{login:login}, select:{login:true, role:true, createdAt:true, avatar:true, posts:true,}});
  if(!data){
    notFound()
  }

  return <ChoosePhotoProvider>
    <StubHeader/>
    <StubUnderHeader/>
    <Profile props={data}/>
  </ChoosePhotoProvider>
}