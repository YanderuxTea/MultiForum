'use client'
import InputAny from '@/components/shared/InputAny'
import React, {useTransition} from 'react'
import useDataUser from '@/hooks/useDataUser'
import useNotify from '@/hooks/useNotify'
import {useRouter} from 'next/navigation'

export default function SecureSettings() {
  const [currentPassword, setCurrentPassword] = React.useState<string>('')
  const [newPassword, setNewPassword] = React.useState<string>('')
  const [changePassword, setChangePassword] = useTransition()
  const dataUser = useDataUser()
  const {setIsNotify, setMessage} = useNotify()
  const router = useRouter()
  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setChangePassword(async ()=>{
      const req = await fetch('/api/changePassword', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({currentPassword:currentPassword,newPassword:newPassword})
      })
      const res = await req.json()
      if(res.status === 404){
        router.push('/invalid')
      }
      if(res.ok){
        setMessage(res.message)
        setIsNotify(true)
        setCurrentPassword('')
        setNewPassword('')
      }else if(res.error){
        setMessage(`Ошибка: ${res.error}`)
        setIsNotify(true)
      }else if(res.issues){
        setMessage(`Ошибка: ${res.issues[0].message}`)
        setIsNotify(true)
      }
    })
  }
  return <div className='flex-col flex gap-5'>
    <p className='text-2xl text-neutral-800 dark:text-neutral-200 font-bold'>Настройки безопасности</p>
    <div className='flex flex-col gap-2.5'>
      <p className='text-neutral-700 dark:text-neutral-300 font-medium'>Смена пароля</p>
      <form onSubmit={handlePasswordChange} className='flex flex-col gap-2.5'>
        <div className='hidden'>
          <InputAny type='text' readonly={true} id='username' autoComplete='username' defaultValue={dataUser?.login} name='username'/>
        </div>
        <div className='flex flex-col gap-2.5 lg:flex-row'>
          <InputAny type='password' value={currentPassword} onChange={setCurrentPassword} placeholder='Текущий пароль' autoComplete='current-password' readonly={changePassword} id='currPassRes' name='currPass'/>
          <InputAny type='password' value={newPassword} onChange={setNewPassword} placeholder='Новый пароль' autoComplete='new-password' readonly={changePassword} id='newPassRes' name='newPass'/>
        </div>
        <button type='submit' disabled={changePassword} className='text-white bg-blue-500 dark:bg-blue-600 hover:bg-blue-400 dark:hover:bg-blue-500 active:bg-blue-600 dark:active:bg-blue-700 font-medium py-1 rounded-md select-none cursor-pointer disabled:cursor-default disabled:bg-gray-500/25 disabled:text-black/25 dark:disabled:text-white/25 dark:disabled:bg-gray-100/25 transition-colors duration-300 ease-in-out'>{changePassword?'Меняем':'Сменить'}</button>
      </form>
    </div>
  </div>
}