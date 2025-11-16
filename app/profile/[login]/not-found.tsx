import {Metadata} from 'next'

export const metadata: Metadata ={
  title:'Multi Forum | Пользователь не найден',
  description: 'Ошибка 404: Профиль пользователя не найден. Возможно, аккаунт был удален или вы ввели неверный никнейм. Воспользуйтесь поиском для навигации.',
  robots: 'noindex, nofollow'
}
export default function NotFoundUser() {
  return <main className='min-h-screen flex items-center justify-center'>
    <p className='font-bold text-center'>Пользователь не найден</p>
  </main>
}