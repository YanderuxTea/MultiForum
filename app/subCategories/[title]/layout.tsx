import {ReactNode} from 'react'
import {Metadata} from 'next'
import StubUnderHeader from '@/components/shared/stubs/StubUnderHeader'
import StubHeader from '@/components/shared/stubs/StubHeader'

export async function generateMetadata({params}:{params:Promise<{title:string}>}):Promise<Metadata> {
  const {title} = await params
  const decodeUrl = decodeURIComponent(title)
  return {
    title:`${decodeUrl}`,
    description: 'Присоединяйся к обсуждению: задай вопрос или помоги другим в теме форума'
  }
}
export default function SubCategoriesLayout({children}: {children: ReactNode}) {
  return <main className='min-h-screen flex-col w-full px-2.5 flex items-center justify-center py-5'>
    <StubUnderHeader/>
    <StubHeader/>
    <div className='bg-white dark:bg-[#212121] w-full min-h-screen max-w-300 border border-neutral-300 dark:border-neutral-700 rounded-md'>
      {children}
    </div>
  </main>
}