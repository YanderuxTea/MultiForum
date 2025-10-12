'use client'
import useNotify from '@/hooks/useNotify'
import {AnimatePresence, motion} from 'framer-motion'

export default function Notify() {
  const {isNotify, message} = useNotify()
  const error = message.includes('Ошибка');
  return<AnimatePresence>
    {isNotify?<motion.div initial={{y:-100}} animate={{y:0}} exit={{y:-250}} className={`text-center text-[16px] rounded-lg p-2.5 w-60 z-2 fixed top-1/12 text-white font-medium ${error?'bg-red-600':'bg-green-500'}`}>{message}</motion.div>:null}
  </AnimatePresence>
}