import TrashIcon from '@/components/shared/icons/TrashIcon'
import React, {useEffect} from 'react'
import {motion, useAnimation} from 'framer-motion'

export default function DeleteButton({eventUsers, pending}:{eventUsers?:()=>void, pending?:boolean}) {
  const controls = useAnimation()
  useEffect(() => {
    if(pending){
      controls.stop()
      controls.start({rotate:0})
    }
  }, [controls, pending])
  return <motion.button disabled={pending} onHoverStart={()=> {
    if (!pending) {
      controls.start({rotate: [0, 10, -10], transition: {repeat: Infinity, repeatType: 'mirror', duration: 1}})
    }
  }} onHoverEnd={()=> {
    controls.stop(); controls.start({rotate:0})
  }} animate={controls} onClick={eventUsers?()=>eventUsers():undefined} className='bg-red-500 hover:bg-red-600 cursor-pointer dark:bg-red-600 dark:hover:bg-red-700 flex justify-center items-center aspect-square rounded-md p-1.25 transition-colors duration-300 ease-out relative after:absolute after:content-[""] after:inset-0 after:rounded-md after:outline after:outline-red-600 dark:after:outline-red-700 after:transition-opacity after:duration-300 after:ease-out after:blur-[3px] hover:after:opacity-100 after:opacity-0 disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:after:opacity-0'>
    <TrashIcon/>
  </motion.button>
}