'use client'
import useHeader from '@/hooks/useHeader'
import StubHeader from '@/components/shared/StubHeader'
import {useEffect} from 'react'
import {motion} from 'framer-motion'
export default function MenuMobile() {
  const {isOpenMenu} = useHeader()
  useEffect(()=>{
    if(isOpenMenu){
      document.body.style.overflow = 'hidden';
    }else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpenMenu])
  return <motion.div initial={{x:`100%`}} animate={{x:`0%`}} exit={{x:`100%`}} transition={{type:'tween', duration:0.2}} className='fixed min-h-screen bg-black/25 z-9 w-full'>
    <div className='flex flex-col overflow-y-auto max-h-screen'>
      <StubHeader/>

      <StubHeader/>
    </div>
  </motion.div>
}

