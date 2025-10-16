'use client'
import {motion} from 'framer-motion'

export default function UserNameplate() {
  return <div className='bg-gray-500 px-2.5 py-1 rounded-md relative overflow-hidden select-none'>
    <p className='text-white font-bold relative z-1'>Пользователь</p>
    <motion.span initial={{left:0}} animate={{left:`110%`}} transition={{duration:1.5, repeatDelay:1, repeat:Infinity}} className='rotate-45 w-1.25 text-transparent bg-white blur-sm absolute overflow-hidden inset-y-0'></motion.span>
  </div>
}
