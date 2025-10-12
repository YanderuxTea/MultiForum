'use client'
import useDataUser from '@/hooks/useDataUser'
import Lock from '@/components/shared/icons/Lock'
import {useRef, useState, useTransition} from 'react'
import InputAny from '@/components/shared/InputAny'
import useNotify from '@/hooks/useNotify'
import {AnimatePresence, motion} from 'framer-motion'

export default function NotifyVerifyEmail() {
  const dataUser = useDataUser()
  const [code, setCode] = useState('')
  const [loading, setLoading] = useTransition()
  const {setIsNotify, setMessage} = useNotify()
  const [success, setSuccess] = useState<boolean>(false)
  const notifyVerifyEmailRef = useRef<HTMLDivElement>(null)
  async function verifyEmail() {
    setLoading(async ()=>{
      try {
        const req = await fetch('/api/verifyEmail', {
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({code:code})
        })
        const res = await req.json()
        if(res.ok){
          setCode('')
          setMessage(res.message)
          setIsNotify(true)
          setSuccess(true)
        }else {
          setMessage(`Ошибка: ${res.error}`)
          setIsNotify(true)
        }
      }catch(err){
        setIsNotify(true)
        setMessage('Внутренняя ошибка')
      }
    })
  }
  return <AnimatePresence>
    {dataUser !== null && dataUser.verifyEmail === 'Verify' ? null : dataUser === null ? null :success?null:
      <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} ref={notifyVerifyEmailRef} className='fixed bg-black/25 inset-0 flex items-center justify-center px-2.5'>
        <motion.div initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} transition={{type:'spring', bounce:0.2}} className='w-full max-w-150 bg-white dark:bg-[#212121] flex flex-col items-center p-5 gap-4.5 rounded-3xl'>
          <div className='flex flex-row gap-2.5'>
            <Lock/>
            <p className='font-medium text-lg'>Подтвердите свою почту</p>
          </div>
          <p className='text-center font-medium'>Введите ниже код подтверждения, отправленный вам на почту <span
            className='font-bold'>{dataUser?.email}</span></p>
          <InputAny value={code} placeholder='Код подтверждения' type='text' onChange={setCode} id='verifyEmailCode'/>
          <button disabled={loading} onClick={() => verifyEmail()}
                  className={`w-full py-1 rounded-md bg-blue-400 dark:bg-blue-500 text-white font-medium cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-600 transition-colors duration-300 ease-out disabled:bg-gray-500/25 disabled:text-black/25 dark:disabled:text-white/25 dark:disabled:bg-gray-100/25`}>{loading ? 'Проверяем' : 'Подтвердить'}</button>
        </motion.div>
      </motion.div>}
  </AnimatePresence>
}