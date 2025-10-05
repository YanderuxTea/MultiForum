'use client'
import {motion} from 'framer-motion'
import {useEffect, useState} from 'react'
import IconLogo from '@/components/shared/icons/IconLogo'

export default function Preloader() {
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    setTimeout(()=>{
      setLoading(false)
    },300)
  }, [])
  return loading && <motion.div animate={{opacity:0}} className='bg-white dark:bg-[#212121] w-full fixed  inset-0 z-1000'>
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
  </motion.div>

}