import {Suspense} from 'react'
import ThemePage from '@/components/ui/ThemePage.tsx'


export default function Page() {
  return <Suspense>
    <ThemePage/>
  </Suspense>
}