'use client'
import Header from '@/components/ui/Header'
import MenuMobile from '@/components/ui/MenuMobile'
import HeaderProviders from '@/components/providers/HeaderProviders'
import StubHeader from '@/components/shared/StubHeader'
import {AnimatePresence} from 'framer-motion'
import useHeader from '@/hooks/useHeader'
import useCurrentWidth from '@/hooks/useCurrentWidth'

export default function MainPage() {
  return (<>
      <HeaderProviders>
        <HeaderWrapper/>
      </HeaderProviders>
      <StubHeader/>
    </>
  )
}

function HeaderWrapper() {
  const {isOpenMenu} = useHeader();
  const width = useCurrentWidth();
  return <>
      <Header/>
      <AnimatePresence>
        {isOpenMenu&&width<768&&<MenuMobile/>}
      </AnimatePresence>
  </>
}