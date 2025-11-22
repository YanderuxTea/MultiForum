import React from 'react'
import {Metadata} from 'next'

export async function generateMetadata({params}:{params:Promise<{login: string}>}):Promise<Metadata>{
  const {login} = await params
  return {
    title: `Multi Forum | ${login}`,
    description: 'Cмотрите активность, уровень, заданные вопросы и ответы. Узнайте больше о других участниках сообщества.'
  }
}
export default function LayoutProfile({children}:{children:React.ReactNode}) {
  return <main>
    {children}
  </main>
}