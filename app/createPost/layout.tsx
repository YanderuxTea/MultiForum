import React from 'react'
import StubHeader from '@/components/shared/stubs/StubHeader'
import StubUnderHeader from '@/components/shared/stubs/StubUnderHeader'

export default function LayoutCreatePost({children}:{children:React.ReactNode}) {
  return <main className='w-full'>
    <StubHeader/>
    <StubUnderHeader/>
    {children}
  </main>
}