import {Suspense} from 'react'
import SubCategoriesPage from '@/components/ui/SubCategoriesPage.tsx'

export default function Page() {
  return <Suspense>
    <SubCategoriesPage/>
  </Suspense>
}