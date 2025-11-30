import CreatePostPage from '@/components/ui/CreatePostPage'
import {Suspense} from 'react'

export default function Page() {
  return <Suspense>
    <CreatePostPage/>
  </Suspense>
}