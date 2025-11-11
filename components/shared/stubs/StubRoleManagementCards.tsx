import {motion} from 'framer-motion'
import {useRef} from 'react'

export default function StubRoleManagementCards() {
  const randomWidth = useRef(Math.floor(Math.random() * (150 - 50))+50).current
  return <motion.div layout exit={{opacity:0}} className='w-full flex flex-row items-center gap-2.5 border p-2.5 rounded-md border-neutral-300 dark:border-neutral-700'>
    <div className='w-12 h-12 aspect-square rounded-full bg-black/25 dark:bg-white/30 animate-pulse'></div>
    <p className='bg-black/25 dark:bg-white/30 animate-pulse h-5 rounded-md' style={{width:`${randomWidth}px`}}></p>
  </motion.div>
}