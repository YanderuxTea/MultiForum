'use client'
import {CSSProperties, useEffect} from 'react'
import {motion, useAnimationControls} from 'framer-motion'

export default function UserNameplate() {
  const controls = useAnimationControls()
  useEffect(() => {
    controls.start({
      '--from':['-10%','100%'],
      '--via': ['0%', '110%'],
      '--to':['10%','120%'],
      transition:{duration:2, repeat:Infinity, ease:'linear', repeatDelay:2},
    })
  }, [controls])
  return <motion.div animate={controls} style={{'--via':'0%', '--from':'-10%', '--to':'10%',background:'linear-gradient(135deg, #6a7282 var(--from), #99a1af var(--via), #6a7282 var(--to))'}as CSSProperties} className='px-2.5 py-1 bg- rounded-md relative overflow-hidden select-none'>
    <p className='text-white font-bold relative z-1'>Пользователь</p>
  </motion.div>
}
