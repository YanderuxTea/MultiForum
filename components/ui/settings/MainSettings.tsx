'use client'
import useDataUser from '@/hooks/useDataUser'
import ButtonRefreshData from '@/components/shared/buttons/ButtonRefreshData'
import IconVerify from '@/components/shared/icons/IconVerify'
import IconNoneVerify from '@/components/shared/icons/IconNoneVerify'
import React from 'react'

export default function MainSettings() {
  const userData = useDataUser()
  const [show, setShow] = React.useState<boolean>(false)
  if(!userData) {
    return null
  }
  return <div className='flex flex-col gap-2.5'>
    <div className='flex flex-row justify-between text-neutral-800 dark:text-neutral-200'>
      <p className='text-2xl font-bold'>Основные настройки</p>
      <ButtonRefreshData/>
    </div>
    <div className='font-medium flex flex-col gap-5'>
      <p>Ваш уникальный идентификатор: {show?<span className='text-neutral-700 dark:text-neutral-300 cursor-pointer' onClick={()=>setShow(false)}>{userData.id}</span>:<button className='select-none cursor-pointer text-neutral-600 dark:text-neutral-400' onClick={()=>setShow(true)}>Показать</button>}</p>
      <p>Ваша электронная почта: <span className='text-neutral-700 dark:text-neutral-300'>{userData.email}</span></p>
      <p className='flex flex-row gap-2.5'>Подтверждение Администратора:{userData.verifyAdm==='Yes'?<IconVerify/>:<IconNoneVerify/>}</p>
    </div>
  </div>
}