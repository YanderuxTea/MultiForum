import Link from 'next/link'
import React from 'react'

export default function NotAuthUser() {
  return <div className='flex flex-col gap-7.5'>
    <div className='flex flex-col gap-2.5'>
      <p className='text-neutral-900 dark:text-neutral-100 text-lg font-bold'>Создайте аккаунт или войдите в него для обсуждения в теме</p>
    </div>
    <div className='flex flex-col gap-2.5 lg:flex-row'>
      <div className='flex flex-col gap-5 items-center lg:mx-auto'>
        <div className='flex flex-col gap-2.5'>
          <p className='text-neutral-900 dark:text-neutral-100 text-lg font-bold'>Войти в аккаунт</p>
          <p className='text-neutral-600 dark:text-neutral-400 text-sm font-medium'>Уже зарегистрированы? Войдите</p>
        </div>
        <Link href={'/auth/login'} className='px-2.5 py-1.25 bg-orange-500 dark:bg-orange-600 max-w-60 w-full transition-colors duration-300 ease-out rounded-sm font-medium text-white hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700'>Войти</Link>
      </div>
      <hr className='text-neutral-300 dark:text-neutral-700 w-full lg:hidden'/>
      <div className='flex flex-col gap-5 items-center'>
        <div className='flex flex-col gap-2.5'>
          <p className='text-neutral-900 dark:text-neutral-100 text-lg font-bold'>Зарегистрировать аккаунт</p>
          <p className='text-neutral-600 dark:text-neutral-400 text-sm font-medium'>У вас нет аккаунта? Создайте его - это займет всего пару секунд!</p>
        </div>
        <Link href={'/auth/register'} className='px-2.5 py-1.25 bg-orange-500 dark:bg-orange-600 max-w-60 w-full transition-colors duration-300 ease-out rounded-sm font-medium text-white hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700'>Зарегистрироваться</Link>
      </div>
    </div>
  </div>

}