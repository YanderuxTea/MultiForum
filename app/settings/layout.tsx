'use client'
import React from 'react'
import SettingsList from '@/components/shared/SettingsList'
import StubHeader from '@/components/shared/StubHeader'
import StubUnderHeader from '@/components/shared/StubUnderHeader'

export default function LayoutSetting({children}: {children: React.ReactNode}) {
  return<main className='min-h-screen w-full px-2.5 py-5 flex  flex-col'>
      <StubHeader/>
      <StubUnderHeader/>
      <div className='flex-col lg:flex-row gap-2.5 w-full max-w-300 flex mx-auto'>
        <SettingsList/>
        {children}
      </div>
    </main>
}