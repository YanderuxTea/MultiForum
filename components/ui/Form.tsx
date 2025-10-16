'use client'
import React, {useTransition} from 'react'
import {useParams, useRouter} from 'next/navigation'
import {loginInputs, registerInputs} from '@/data/formInputs'
import InputCustom from '@/components/shared/InputCustom'
import useFormContext from '@/hooks/useFormContext'
import {AnimatePresence, motion} from 'framer-motion'
import useNotify from '@/hooks/useNotify'
import Link from 'next/link'

export default function Form() {
  const [isPending, startTransition] = useTransition()
  const params = useParams();
  const inputsArray = params.type === 'login' ? loginInputs: registerInputs;
  const {isValid} = useFormContext()
  const router = useRouter();
  const {setIsNotify, setMessage} = useNotify()

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const data = Object.fromEntries(form)
    startTransition(async ()=>{
      try{
        const res = await fetch(`/api/${params.type}`,{
          method: 'POST',
          body: JSON.stringify(data),
          headers: {"Content-Type": "application/json"}
        })
        const json = await res.json()
        if(json.ok){
          if(params.type === 'login'){
            router.push('/')
            window.location.reload()
          }else if(params.type === 'register'){
            setIsNotify(true)
            setMessage(json.message)
            router.push('/auth/login')
          }
        }else {
          setIsNotify(true)
          let errorMessage = json.error;
          for(const field in json.error.fieldErrors){
            if(json.error.fieldErrors[field].length > 0){
              errorMessage = json.error.fieldErrors[field][0]
              break;
            }
          }
          setMessage(`Ошибка: ${errorMessage}`)
        }
      }catch(err){
        setIsNotify(true)
        setMessage(`Ошибка: ${err}`)
        console.error(err)
      }
    })
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
              className='select-none cursor-pointer disabled:cursor-default hover:bg-orange-500 dark:hover:bg-orange-600 py-1.25 dark:bg-orange-700 bg-orange-600 active:bg-orange-700 dark:active:bg-orange-800 w-full rounded-lg text-white font-medium disabled:bg-gray-500/25 disabled:text-black/25 dark:disabled:text-white/25 dark:disabled:bg-gray-100/25 transition-co duration-300 ease-in-out'>
        {params.type === 'login' ? isPending ? 'Входим' : 'Войти' : isPending ? 'Регистрируем' : 'Зарегистрироваться'}
      </button>
      <Link href={'/recovery'} className='text-sm text-neutral-500 dark:text-neutral-400 font-medium hover:text-blue-500 dark:hover:text-blue-600 transition-colors duration-300 ease-out'>Забыли пароль?</Link>
    </motion.form>
  </AnimatePresence>
}