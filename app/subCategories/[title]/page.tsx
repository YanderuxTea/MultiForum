'use client'
import {useParams, useSearchParams} from 'next/navigation'
import useDataUser from '@/hooks/useDataUser'
import Link from 'next/link'

export default function Page() {
  const searchParams = useSearchParams()
  const params = useParams()
  const idSubCat = searchParams.get('subCategory')
  const userData = useDataUser()
  if (!idSubCat||typeof params.title !== 'string') {
    return <p>Такого раздела нет</p>
  }
  const title = decodeURIComponent(params.title)
  return <div className='divide-y divide-neutral-300 dark:divide-neutral-700 flex flex-col gap-2.5'>
    <div className='flex flex-row justify-between items-center p-2.5'>
      <p className='text-lg font-bold text-neutral-900 dark:text-neutral-100 md:text-2xl'>{title}</p>
      {userData&&userData.verifyAdm === 'Yes'&& <Link href={`/createPost?subCategory=${idSubCat}`} className='font-medium text-white bg-orange-500 dark:bg-orange-600 px-2.5 py-1.25 rounded-sm transition-colors duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 cursor-pointer'>Создать</Link>}
    </div>
    <div className='p-2.5'>

    </div>
  </div>
}