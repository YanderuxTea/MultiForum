import {ReactNode} from 'react'
import {Metadata} from 'next'

export const metadata:Metadata = {
  title:'Multi Forum | Восстановление пароля',
  description: 'Забыли пароль? Быстро и безопасно восстановите доступ к своему аккаунту разработчика. Получите код для сброса на вашу электронную почту.'
}
export default function LayoutRecovery({children}: {children: ReactNode}) {
  return <main className='min-h-screen flex items-center w-full px-2.5 justify-center'>
    {children}
  </main>
}