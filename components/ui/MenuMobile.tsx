'use client'
import useHeader from '@/hooks/useHeader'
import StubHeader from '@/components/shared/StubHeader'
import {useEffect, useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import ButtonLogin from '@/components/shared/ButtonLogin'
import SwitcherTheme from '@/components/shared/SwitcherTheme'
import useDataUser from '@/hooks/useDataUser'
import Arrow from '@/components/shared/icons/Arrow'
import ButtonLogout from '@/components/shared/ButtonLogout'
import useCurrentWidth from '@/hooks/useCurrentWidth'


export default function MenuMobile() {
  const {isOpenMenu, setIsOpenMenu} = useHeader()
  const dataUser = useDataUser();
  const [isOpenUserMenu, setIsOpenUserMenu] = useState(false);
  const width = useCurrentWidth()
  useEffect(() => {
    function handleResize(){
      if(width<=768){
        setIsOpenMenu(false);
      }
    }
    window.addEventListener('resize', handleResize)
    return () => {window.removeEventListener('resize', handleResize)}
  }, [])
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
        {dataUser === null?<ButtonLogin/>: (<div className='flex flex-col justify-between w-full'>
          <div className='flex flex-row justify-between'>
            <p>{dataUser.login}</p>
            <button className={`${isOpenUserMenu?'rotate-180':'rotate-0'} transition-transform duration-300 ease-in-out`} onClick={()=>setIsOpenUserMenu(!isOpenUserMenu)}>
              <Arrow/>
            </button>
          </div>
          <AnimatePresence>
            {isOpenUserMenu&&<motion.div className='overflow-hidden w-[80%] ml-auto flex' initial={{maxHeight:0}} animate={{maxHeight:100, paddingTop:10, paddingBottom:5}} exit={{maxHeight:0, paddingTop:0, paddingBottom:0}} transition={{duration:0.3}} layout>
              <ButtonLogout/>
            </motion.div>}
          </AnimatePresence>
        </div>)}
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
