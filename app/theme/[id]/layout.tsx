import {Metadata} from 'next'
import React from 'react'
import StubUnderHeader from '@/components/shared/stubs/StubUnderHeader'
import StubHeader from '@/components/shared/stubs/StubHeader'

export async function generateMetadata({params}:{params:Promise<{id:string}>}):Promise<Metadata>{
  const {id} = await params
  const decode = decodeURIComponent(id)
  return {
    title: `${decode}`,
    description: 'Присоединяйся к обсуждению: задай вопрос или помоги другим в теме форума'
  }
}
export default function ThemeLayout({children}:{children:React.ReactNode}) {
  return <main className='flex flex-col min-h-screen w-full p-2.5 items-center'>
    <StubHeader/>
    <StubUnderHeader/>
    {children}
  </main>
}