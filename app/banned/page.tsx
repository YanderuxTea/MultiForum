import BannedPage from '@/components/ui/BannedPage'
import {Suspense} from 'react'
import {Metadata} from 'next'

export const metadata: Metadata ={
  title:'Multi Forum | Заблокирован',
  description: 'Доступ к форуму временно или постоянно ограничен в связи с нарушением правил сообщества. Для обжалования решения обратитесь к администрации.',
  robots: 'noindex, nofollow'
}
export default function Page() {
  return <Suspense>
    <BannedPage />
  </Suspense>
}