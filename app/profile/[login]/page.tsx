import Profile from '@/components/ui/profiles/Profile'
import {notFound} from 'next/navigation'
import {prisma} from '@/lib/prisma'
import ChoosePhotoProvider from '@/components/providers/ChoosePhotoProvider'
import StubHeader from '@/components/shared/stubs/StubHeader'
import StubUnderHeader from '@/components/shared/stubs/StubUnderHeader'

export default async function Page({params}:{params:Promise<{login: string}>}) {
  const {login} = await params
  const data = await prisma.users.findUnique({where:{login:login}, select:{login:true, role:true, createdAt:true, avatar:true, posts:true, bans:{include:{Unbans:true}}, warns:{include:{Unwarns:true}}}});
  if(!data){
    notFound()
  }

  return <ChoosePhotoProvider>
    <StubHeader/>
    <StubUnderHeader/>
    <Profile props={data}/>
  </ChoosePhotoProvider>
}