'use client'
import {AnimatePresence, motion} from 'framer-motion'
import IconLogo from '@/components/shared/icons/IconLogo'
import useLoader from '@/hooks/useLoader'
import {useEffect, useState} from 'react'

export default function Preloader() {
  const {loading} = useLoader()
  const [firstRender, setFirstRender] = useState<boolean>(true)
  useEffect(() => {
    setTimeout(()=>{
      setFirstRender(false)
    },150)
  }, [])
  return <>
      <AnimatePresence>
      {loading && <motion.div exit={{opacity: 0}} className='bg-white dark:bg-[#212121] w-full fixed  inset-0 z-1000'>
        <div className='relative w-full h-full flex items-center justify-center'>
          <div className='w-10 rounded-full aspect-square z-10 bg-white'><IconLogo/></div>
          <motion.div animate={{rotate: 360}} transition={{repeat: Infinity, duration: 2, ease: 'linear'}}
                      className='absolute w-full flex items-center justify-center'>
            {Array(10).fill(0).map((_, index) => {
              const rotate = 360 / 10 * index
              return <div key={index} className='w-15 h-0.5 z-9 bg-gray-700 dark:bg-white absolute'
                          style={{transform: `rotate(${rotate}deg)`}}></div>
            })}
          </motion.div>
        </div>
      </motion.div>}
    </AnimatePresence>
    {firstRender&&<div className='bg-white dark:bg-[#212121] fixed w-full inset-0 z-50'></div>}
  </>
}