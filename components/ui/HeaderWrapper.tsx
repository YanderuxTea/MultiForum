'use client'
import Header from '@/components/ui/Header'
import {AnimatePresence} from 'framer-motion'
import MenuMobile from '@/components/ui/MenuMobile'
import useHeader from '@/hooks/useHeader'
import useCurrentWidth from '@/hooks/useCurrentWidth'

export default function HeaderWrapper() {
  const {isOpenMenu} = useHeader();
  const width = useCurrentWidth();
  return <>
    <Header/>
    <AnimatePresence>
      {isOpenMenu&&width<=768&&<MenuMobile/>}
    </AnimatePresence>
  </>
}