import {ReactNode} from 'react'
import {Metadata} from 'next'

export async function generateMetadata({params}:{params:Promise<{title:string}>}):Promise<Metadata> {
  const {title} = await params
  const decodeUrl = decodeURIComponent(title)
  return {
    title:`${decodeUrl}`,
    description: 'Присоединяйся к обсуждению: задай вопрос или помоги другим в теме форума'
  }
}
export default function SubCategoriesLayout({children}: {children: ReactNode}) {
  return <main>
    {children}
  </main>
}