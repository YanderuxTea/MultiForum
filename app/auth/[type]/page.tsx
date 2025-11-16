import {notFound} from 'next/navigation'
import React from 'react'
import Form from '@/components/ui/Form'
import {Metadata} from 'next'

export async function generateMetadata({params}:{params:Promise<{type:string}>}):Promise<Metadata> {
  const {type} = await params
  if(type!=='login' && type !=='register'){
    return {
      title: 'Multi Forum'
    }
  }
  return {
    title: type === 'login' ? 'Multi Forum | Вход' : 'Multi Forum | Регистрация',
    description: 'Регистрация или вход на крупнейший форум разработчиков. Присоединяйтесь, чтобы задавать вопросы, получать помощь по коду и общаться с другими программистами.'
  }
}
export default async function Page({params}: {params:Promise<{ type: string }>}) {
  const {type} = await params;
  if(type !== 'login' && type !== 'register') {
    notFound();
  }
  return <Form/>
}