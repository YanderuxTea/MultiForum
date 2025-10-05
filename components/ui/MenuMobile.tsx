'use client'
import useHeader from '@/hooks/useHeader'
import StubHeader from '@/components/shared/StubHeader'
import {useEffect} from 'react'
import {motion} from 'framer-motion'
import ButtonLogin from '@/components/shared/ButtonLogin'
import SwitcherTheme from '@/components/shared/SwitcherTheme'
export default function MenuMobile() {
  const {isOpenMenu, setIsOpenMenu} = useHeader()
  useEffect(()=>{
    if(isOpenMenu){
      document.body.style.overflow = 'hidden';
    }else {
      document.body.style.overflow = 'unset'
    }
  }, [isOpenMenu])
  return <><motion.div initial={{x:`100%`}} animate={{x:`0%`}} exit={{x:`100%`}} transition={{type:'tween', duration:0.2}} className='fixed min-h-screen flex z-10 bg-white dark:bg-[#212121] w-[80%] right-0'>
      <div className='flex flex-col overflow-y-auto max-h-screen z-10 text-black dark:text-white w-full gap-2.5 p-2.5'>
        <StubHeader/>
          <ButtonLogin/>
        <div className='border-t border-gray-700/25 dark:border-white/10 flex flex-col gap-2.5 py-2.5'>
          <div className='flex flex-row items-center justify-between'>
            <p className='font-medium'>Тема</p>
            <SwitcherTheme/>
          </div>
        </div>
        <StubHeader/>
      </div>
  </motion.div>
    <motion.div onTouchStart={()=>setIsOpenMenu(prevState => !prevState)} className='fixed min-h-screen bg-black/25 w-full opacity-0 z-2' animate={{opacity:1}} exit={{opacity:0}}></motion.div>
  </>
}

