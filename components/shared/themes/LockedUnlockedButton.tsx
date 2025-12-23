import {IMessage} from '@/context/CategoriesContext'
import React from 'react'
import useNotify from '@/hooks/useNotify'
import {useSearchParams} from 'next/navigation'

export default function LockedUnlockedButton({locked, setMessages}:{locked:boolean, setMessages:React.Dispatch<React.SetStateAction<IMessage[]|undefined>>}) {
  const {setMessage, setIsNotify} = useNotify()
  const searchParams = useSearchParams()
  const themeId = searchParams.get('themeId')
  async function handleLockedUnlocked(){
    const req = await fetch('/api/categories/lockedUnlocked', {
      method: "POST",
      body: JSON.stringify({locked:locked, themeId:themeId}),
      headers: {'content-type': 'application/json'}
    })
    const res = await req.json()
    if(res.ok){
      setMessages(prevState => (prevState||[]).map((mess)=>{
        return {
          ...mess,
          Posts:{
            ...mess.Posts,
            locked:!locked
          }
        }
      }))
    }else {
      setMessage(`Ошибка: ${res.error}`)
      setIsNotify(true)
    }
  }
  return <div className='flex justify-end'>
    <button onClick={()=>handleLockedUnlocked()} className='cursor-pointer px-2.5 py-1.25 bg-neutral-300 rounded-md font-medium text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200 transition-colors duration-300 ease-out hover:bg-neutral-400 dark:hover:bg-neutral-700 active:bg-neutral-200 dark:active:bg-neutral-900'>{locked?'Открыть':'Закрыть'}</button>
  </div>
}