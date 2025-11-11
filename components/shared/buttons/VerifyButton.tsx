import React, {useEffect} from 'react'
import {motion, useAnimation} from 'framer-motion'
import IconCheck from '@/components/shared/icons/IconCheck'

export default function VerifyButton({eventUsers, pending}: { eventUsers?: ()=> void, pending?:boolean }) {
  const controls = useAnimation()
  useEffect(() => {
    if(pending){
      controls.stop()
      controls.start({y:0})
    }
  }, [controls, pending])
  return <motion.button disabled={pending} onHoverStart={()=> {
    if (!pending) {
      controls.start({y: -2, transition: {repeat: Infinity, repeatType: 'reverse', duration: 0.5}})
    }
  }} onHoverEnd={()=> {controls.stop(); controls.start({y:0})}} animate={controls} onClick={eventUsers?()=>eventUsers():undefined} className='bg-green-500 hover:bg-green-600 cursor-pointer dark:bg-green-600 dark:hover:bg-green-700 flex justify-center items-center aspect-square rounded-md p-1.25 transition-colors duration-300 ease-out relative after:absolute after:content-[""] after:inset-0 after:rounded-md after:outline after:outline-green-600 dark:after:outline-green-700 after:transition-opacity after:duration-300 after:ease-out after:blur-[3px] hover:after:opacity-100 after:opacity-0 disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:after:opacity-0'>
    <IconCheck/>
  </motion.button>
}