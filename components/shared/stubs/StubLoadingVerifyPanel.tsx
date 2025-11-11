import VerifyButton from '@/components/shared/buttons/VerifyButton'
import DeleteButton from '@/components/shared/buttons/DeleteButton'
import React, {useRef} from 'react'
import {motion} from 'framer-motion'

export default function StubLoadingVerifyPanel() {
  const randomNumberNickname = useRef(Math.floor(Math.random() * (188 - 70))+70).current
  const randomNumberEmail = useRef(Math.floor(Math.random() * (188 - 100))+100).current
  return <motion.div exit={{opacity:0}} layout className='border px-2.5 py-1.25 rounded-md border-neutral-300 dark:border-neutral-700 flex flex-row justify-between gap-2.5 items-center'>
    <div className='flex flex-col w-[80%] gap-2.5'>
      <p className='bg-black/25 dark:bg-white/30 rounded-md animate-pulse text-transparent h-5' style={{width:`${randomNumberNickname}px`}}></p>
      <p className='bg-black/25 dark:bg-white/30 rounded-md animate-pulse text-transparent h-2.5' style={{width:`${randomNumberEmail}px`}}></p>
    </div>
    <div className='flex flex-col gap-1.25'>
      <VerifyButton/>
      <DeleteButton/>
    </div>
  </motion.div>
}