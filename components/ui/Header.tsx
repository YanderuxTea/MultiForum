'use client'
import Logo from '@/components/shared/Logo'
import Menu from '@/components/shared/icons/Menu'
import useCurrentWidth from '@/hooks/useCurrentWidth'
import useHeader from '@/hooks/useHeader'
import ButtonLogin from '@/components/shared/ButtonLogin'
import useDataUser from '@/hooks/useDataUser'
import Arrow from '@/components/shared/icons/Arrow'
import React, {useEffect, useRef, useState} from 'react'
import ButtonLogout from '@/components/shared/ButtonLogout'
import {AnimatePresence, motion} from 'framer-motion'
import ProfileButton from '@/components/shared/ProfileButton'

export default function Header() {
  const width = useCurrentWidth()
  const {setIsOpenMenu} = useHeader();
  const [openMenuAuth, setOpenMenuAuth] = useState(false);
  const userData = useDataUser()
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function toggleMenu(e:MouseEvent){
      if (menuRef.current&&!menuRef.current.contains(e.target as Node)){
        setOpenMenuAuth(false)
      }
    }
    window.addEventListener('mousemove', toggleMenu)
    return () => {window.removeEventListener('mousemove', toggleMenu)}
  }, [])
  return <header className='w-full flex items-center px-2.5 bg-white dark:bg-[#212121] fixed z-20 justify-center border-b border-neutral-300 dark:border-neutral-700'>
    <div className='max-w-300 w-full bg-white dark:bg-[#212121] flex flex-row justify-between'>
        <Logo/>
      {width<=768&&<button onClick={()=>setIsOpenMenu(prevState => !prevState)}><Menu/></button>}
      {width>768&& userData === null?<div className='flex items-center'><ButtonLogin/></div>:width>768&&
        <div ref={menuRef} onMouseMove={()=>setOpenMenuAuth(true)} className='flex flex-row justify-between items-center gap-2.5 relative'>
          <p className='select-none font-medium text-neutral-800 dark:text-neutral-200 text-lg'>{userData?.login}</p>
          <span className={`transition-transform duration-300 ease-out ${openMenuAuth ? 'rotate-180': 'rotate-0'}`}>
            <Arrow/>
          </span>
          <AnimatePresence>
            {openMenuAuth&&
              <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='flex-col gap-2.5 flex rounded-b-[14px] border-x border-b border-gray-700/25 dark:border-white/10 absolute right-0 top-14 -z-1 bg-white dark:bg-[#212121] p-2.5 w-42.5'>
                <ProfileButton/>
                <hr className='text-neutral-300 dark:text-neutral-700' />
                <ButtonLogout/>
              </motion.div>}
          </AnimatePresence>
        </div>}
    </div>
  </header>
}