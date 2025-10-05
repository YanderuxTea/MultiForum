'use client'
import React, {useEffect} from 'react'
import {HeaderContext} from '@/context/HeaderContext'
import {usePathname} from 'next/navigation'

export default function HeaderProviders({children}: {children: React.ReactNode}) {
  const [isOpenMenu, setIsOpenMenu] = React.useState(false);
  const pathname = usePathname();
  const value = {
    isOpenMenu,
    setIsOpenMenu,
  }
  useEffect(() => {
    setIsOpenMenu(false);
  }, [pathname])
  return <HeaderContext.Provider value={value}>{children}</HeaderContext.Provider>
}
