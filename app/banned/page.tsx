import BannedPage from '@/components/ui/BannedPage'
import {Suspense} from 'react'

export default function Page() {
  return <Suspense>
    <BannedPage />
  </Suspense>
}