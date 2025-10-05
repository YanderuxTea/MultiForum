import {notFound} from 'next/navigation'
import React from 'react'
import Form from '@/components/ui/Form'

export default async function Page({params}: {params:Promise<{ type: string }>}) {
  const {type} = await params;
  if(type !== 'login' && type !== 'register') {
    notFound();
  }
  return <Form/>
}