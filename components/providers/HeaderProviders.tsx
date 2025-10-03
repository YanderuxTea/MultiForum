'use client'
import React from 'react'
import {HeaderContext} from '@/context/HeaderContext'

export default function HeaderProviders({children}: {children: React.ReactNode}) {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const value = {
    isOpenMenu,
    setIsOpenMenu,
  }
  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
}
