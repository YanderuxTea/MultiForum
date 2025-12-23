import {Suspense} from 'react'
import MainPage from '@/components/ui/MainPage.tsx'

export default function Page() {
  return <Suspense>
    <MainPage/>
  </Suspense>
}