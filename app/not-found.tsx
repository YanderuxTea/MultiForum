import {Metadata} from 'next'

export const metadata:Metadata = {
  title: 'Multi Forum | 404',
  description: 'Страница не найдена. Возможно, ссылка устарела или не существует. Вернитесь на главную страницу мультифорума для разработчиков и продолжите поиск решений.',
  robots: 'noindex, nofollow'
}
export default function NotFound() {
  return <main className='min-h-screen flex items-center justify-center'>
    <p className='font-bold text-center'>Ошибка 404 <br/> Страница не найдена :(</p>
  </main>
}