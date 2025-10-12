'use client'
import InputAny from '@/components/shared/InputAny'
import {AnimatePresence, motion} from 'framer-motion'
import React from 'react'
import useNotify from '@/hooks/useNotify'
import {useRouter} from 'next/navigation'


export default function Page() {
  const [email, setEmail] = React.useState('')
  const [sendEmail, setSendEmail] = React.useState(false)
  const [password, setPassword] = React.useState('')
  const [code, setCode] = React.useState('')
  const [confirmCode, setConfirmCode] = React.useState(false)
  const {setIsNotify, setMessage} = useNotify()
  const [loading, setLoading] = React.useTransition()
  const router = useRouter()
  async function resetPassword(id: string) {
    const data = id === 'sendRecoveryCode'? {email:email}:id==='confirmRecoveryCode'? {email:email,code:code}:{email: email, code:code, password:password}
    try {
      setLoading(async ()=>{
        const res = await fetch(`/api/${id}`,{
          method: 'POST',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(data),
        })
        const json = await res.json()
        if(json.ok){
          if(id==='sendRecoveryCode'){
            setSendEmail(true)
          }else if(id==='confirmRecoveryCode'){
            setConfirmCode(true)
          }else {
            setIsNotify(true)
            setMessage(json.message)
            router.push('/auth/login')
          }
        }else {
          setIsNotify(true)
          let error = json.error;
          for(const field in json.error.fieldErrors){
            if(json.error.fieldErrors[field].length > 0){
              error = json.error.fieldErrors[field][0]
              break;
            }
          }
          setMessage(`Ошибка: ${error}`)
        }
      })
    }catch (err){
      setMessage('Ошибка: Неизвестная ошибка')
      setIsNotify(true)
    }
  }
  return <main className='min-h-screen flex items-center w-full px-2.5 justify-center'>
    <div className='border max-w-150 gap-2.5 flex flex-col p-2.5 rounded-2xl bg-white dark:bg-[#212121] border-gray-700/25 w-full'>
      <p className='text-center font-medium text-lg'>Восстановление пароля</p>
      <AnimatePresence mode='popLayout'>
        {!sendEmail&&<motion.div key={'sendMailRecovery'} className='flex items-center flex-col gap-2.5 overflow-hidden ' layout initial={{scale:0, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0, opacity:0}} transition={{type:'spring', bounce:0.2}}>
          <InputAny readonly={loading} type='email' placeholder='Email' id='email' value={email} onChange={setEmail} autoComplete='email'/>
          <button onClick={(e)=>resetPassword(e.currentTarget.id)} disabled={loading} id='sendRecoveryCode' className='bg-blue-400 dark:bg-blue-500 text-white font-medium rounded-md w-full py-1 disabled:bg-gray-500/25 disabled:text-black/25 dark:disabled:text-white/25 dark:disabled:bg-gray-100/25 transition-colors duration-300 ease-in-out cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-600'>{loading?'Отправляем код':'Отправить код'}</button>
        </motion.div>}
      </AnimatePresence>
      <AnimatePresence mode='popLayout'>
        {sendEmail&&!confirmCode&&<motion.div key={'confirmCodeRecovery'} layout initial={{scale:0, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0, opacity:0}} transition={{type:'spring', bounce:0.2}} className='gap-2.5 flex flex-col items-center overflow-hidden'>
          <InputAny readonly={loading} type='text' placeholder='Код подтверждения' id='code' value={code} onChange={setCode}/>
          <button onClick={(e)=>resetPassword(e.currentTarget.id)} disabled={loading} id='confirmRecoveryCode' className='bg-blue-400 dark:bg-blue-500 text-white font-medium rounded-md w-full py-1 disabled:bg-gray-500/25 disabled:text-black/25 dark:disabled:text-white/25 dark:disabled:bg-gray-100/25 transition-all duration-300 ease-in-out cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-600'>{loading?'Проверяем':'Подтердить код'}</button>
        </motion.div>}
      </AnimatePresence>
      <AnimatePresence mode='popLayout'>
        {confirmCode&&<motion.div key={'resetPassRecovery'} initial={{scale:0, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0, opacity:0}} transition={{type:'spring', bounce:0.2}} layout className='flex flex-col items-center overflow-hidden gap-2.5'>
          <InputAny readonly={loading}  type='password' placeholder='Новый пароль' id='password' value={password} onChange={setPassword}
                    autoComplete='new-password'/>
          <button onClick={(e)=>resetPassword(e.currentTarget.id)} disabled={loading} id='resetPassword' className='bg-blue-400 dark:bg-blue-500 text-white font-medium rounded-md w-full py-1 disabled:bg-gray-500/25 disabled:text-black/25 dark:disabled:text-white/25 dark:disabled:bg-gray-100/25 transition-all duration-300 ease-in-out cursor-pointer hover:bg-blue-500 dark:hover:bg-blue-600'>{loading?'Меняем пароль':'Сменить пароль'}</button>
        </motion.div>}
      </AnimatePresence>
    </div>
  </main>
}