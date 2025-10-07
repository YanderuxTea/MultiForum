'use client'
import React, {useTransition} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {loginInputs, registerInputs} from '@/data/formInputs'
import InputCustom from '@/components/shared/InputCustom'
import useFormContext from '@/hooks/useFormContext'
import {AnimatePresence, motion} from 'framer-motion'
import useNotify from '@/hooks/useNotify'

export default function Form() {
  const [isPending, startTransition] = useTransition()
  const params = useParams();
  const inputsArray = params.type === 'login' ? loginInputs: registerInputs;
  const {isValid} = useFormContext()
  const router = useRouter();
  const {setIsNotify, setMessage} = useNotify()
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form)
    try {
      startTransition(async () => {
        const req = await fetch(`/api/${params.type}`, {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {'Content-Type': 'application/json'}
        })
        const res = await req.json()
        if(res.ok){
          setIsNotify(true)
          setMessage(res.message)
          if(params.type === 'login'){
            router.push('/')
          }else if(params.type === 'register'){
            router.push('/auth/login')
          }
        }else {
          setIsNotify(true)
          let message = res.error
          for(const fieldName in res.error.fieldErrors){
            if(res.error.fieldErrors[fieldName].length > 0){
              message = res.error.fieldErrors[fieldName][0]
              break
            }
          }
          setMessage(`Ошибка: ${message}`)
        }
      })
    }catch(err){
      console.log(err)
    }
  }
  return<AnimatePresence>
    <motion.form onSubmit={onSubmit} initial={{scale: 0, opacity: 0}} animate={{scale: 1, opacity: 1}}
                 transition={{type: 'spring', bounce: 0.25}}
                 className='flex flex-col items-center justify-center w-full gap-5 h-full overflow-hidden'>
      {inputsArray.map((input, i) => {
        return <InputCustom key={i} type={input.type} placeholder={input.placeholder} id={input.id}
                            autoComplete={input.autoComplete} pattern={input.pattern} min={input.min} max={input.max}
                            reason={input.reason}/>
      })}
      <button disabled={isPending ? isPending : params.type === 'login' ? isValid.length !== 2 : isValid.length !== 3}
              type='submit'
              className='cursor-pointer disabled:cursor-default hover:bg-orange-500 py-1.25 bg-orange-400 w-full rounded-lg text-white font-medium disabled:bg-gray-500/25 disabled:text-black/25 dark:disabled:text-white/25 dark:disabled:bg-gray-100/25 transition-all duration-300 ease-in-out'>{params.type === 'login' ? isPending ? 'Входим' : 'Войти' : isPending ? 'Регистрируем' : 'Зарегистрироваться'}</button>
    </motion.form>
  </AnimatePresence>
}