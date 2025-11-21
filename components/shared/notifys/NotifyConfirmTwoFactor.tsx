'use client'
import InputAny from '@/components/shared/inputs/InputAny'
import React, {useState} from 'react'
import useTwoFactor from '@/hooks/useTwoFactor'
import useNotify from '@/hooks/useNotify'
import {AnimatePresence, motion} from 'framer-motion'

export default function NotifyConfirmTwoFactor() {
  const [code, setCode] = useState<string>('')
  const twoFactor = useTwoFactor()
  const {setIsNotify, setMessage} = useNotify()
  const [confirm, setConfirm] = useState<boolean>(false)
  const [pending, setPending] = React.useTransition()
  async function confirmCode() {
    setPending(async ()=>{
      if(code.trim().length === 0){
        setIsNotify(true)
        setMessage('Ошибка: вы не ввели код')
        return
      }else {
        const req = await fetch('/api/twoFactor/confirm', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({code:code})
        })
        const res = await req.json()
        if(res.ok){
          setIsNotify(true)
          setMessage(res.message)
          setConfirm(true)
        }else {
          setIsNotify(true)
          setMessage(`Ошибка: ${res.error??res.message}`)
        }
      }
    })
  }
  return <AnimatePresence>
    {  confirm?null:twoFactor?twoFactor.confirm?null :
        <motion.div exit={{opacity:0}} transition={{duration:0.4}} className='bg-black/25 fixed inset-0 flex items-center justify-center z-100 backdrop-blur-[2px] px-2.5'>
          <div className='w-full max-w-100 bg-white dark:bg-[#212121] flex flex-col items-center p-5 rounded-xl gap-5 border border-neutral-300 dark:border-neutral-700'>
            <p className='font-bold text-xl'>Подтверждение</p>
            <InputAny placeholder='Введите код' name='confCode' onChange={setCode} value={code} id='confCodeid' type='text' readonly={pending}/>
            <button disabled={pending} onClick={()=>confirmCode()} className='disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 transition-colors duration-300 ease-out bg-orange-500 dark:bg-orange-600 w-full rounded-md py-1.25 hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 cursor-pointer font-medium text-white'>{pending?'Проверяем':'Подтвердить'}</button>
          </div>
        </motion.div>
      :null}
  </AnimatePresence>

}