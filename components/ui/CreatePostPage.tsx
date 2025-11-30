'use client'
import useDataUser from '@/hooks/useDataUser'
import {useSearchParams} from 'next/navigation'
import InputAny from '@/components/shared/inputs/InputAny'
import {useState} from 'react'
import InputArea from '@/components/shared/inputs/InputArea'

export default function CreatePostPage() {
  const userData = useDataUser()
  const searchParams = useSearchParams()
  const idSubCat = searchParams.get('subCategory')
  const [title, setTitle] = useState('')
  if(!userData || userData.verifyAdm !== 'Yes') {
    return <p>У вас недостаточно прав для создания тем</p>
  }
  if(!idSubCat) {
    return <p>Такого раздела нет</p>
  }
  return <div className='flex flex-col w-full min-h-screen px-2.5 py-5 gap-5 justify-center items-center'>
    <div className='w-full max-w-300 p-2.5 bg-white dark:bg-[#212121] border border-neutral-300 dark:border-neutral-700 rounded-sm flex flex-col gap-2.5'>
      <p className='font-bold text-neutral-900 dark:text-neutral-100 text-lg md:text-xl'>Создание темы</p>
      <InputAny type='text' id='createPost' name='title' placeholder='Введите название темы' value={title} onChange={setTitle}/>
    </div>
    <InputArea/>
  </div>
}