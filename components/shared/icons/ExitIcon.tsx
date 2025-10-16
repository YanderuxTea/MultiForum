'use client'
import {motion} from 'framer-motion'

export default function ExitIcon() {
  return <motion.svg whileHover={{rotate:90}} transition={{duration:0.3}} viewBox="0 0 24 24" className='fill-none w-6 h-6' xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" className='stroke-2 stroke-neutral-800 dark:stroke-white group-hover:stroke-red-600 group-active:stroke-red-600 transition-colors duration-300 ease-out' style={{strokeLinecap:'round', strokeLinejoin:'round'}}/>
    <path d="M6 6L18 18" className='stroke-2 stroke-neutral-800 dark:stroke-white group-hover:stroke-red-600 group-active:stroke-red-600 transition-colors duration-300 ease-out' style={{strokeLinecap:'round', strokeLinejoin:'round'}}/>
  </motion.svg>

}