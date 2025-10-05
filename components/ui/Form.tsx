'use client'
import React from 'react'
import {useParams} from 'next/navigation'
import {loginInputs, registerInputs} from '@/data/formInputs'
import InputCustom from '@/components/shared/InputCustom'
import useFormContext from '@/hooks/useFormContext'
import {AnimatePresence, motion} from 'framer-motion'

export default function Form() {
  const params = useParams();
  const inputsArray = params.type === 'login' ? loginInputs: registerInputs;
  const {isValid} = useFormContext()
  return<AnimatePresence>
    <motion.form initial={{scale:0, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'spring', bounce:0.25}} className='flex flex-col items-center justify-center w-full gap-5 h-full overflow-hidden'>
      {inputsArray.map((input, i) => {
        return <InputCustom key={i} type={input.type} placeholder={input.placeholder} id={input.id} autoComplete={input.autoComplete} pattern={input.pattern} min={input.min} max={input.max} reason={input.reason} />
      })}
      <button disabled={params.type==='login'?isValid.length !== 2:isValid.length !== 3} type='submit' className='py-1.25 bg-orange-400 w-full rounded-lg text-white font-medium disabled:bg-gray-500/25 disabled:text-black/25 dark:disabled:text-white/25 dark:disabled:bg-gray-100/25 transition-colors duration-300 ease-in-out'>{params.type === 'login'? 'Войти': 'Зарегистрироваться'}</button>
    </motion.form>
  </AnimatePresence>
}