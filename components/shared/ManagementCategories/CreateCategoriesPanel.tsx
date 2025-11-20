import InputPunishment from '@/components/shared/inputs/InputPunishment'
import React from 'react'
import useNotify from '@/hooks/useNotify'
import useCategories from '@/hooks/useCategories'
import {motion} from 'framer-motion'

export default function CreateCategoriesPanel({pending, setPending, setOpenMenu}:{pending:boolean, setPending:React.TransitionStartFunction, setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>}) {
  const [title, setTitle] = React.useState<string>('')
  const {setIsNotify, setMessage} = useNotify()
  const {setCategories} = useCategories()
  async function createCategories(){
    setPending(async ()=>{
      if(title.trim().length === 0){
        setIsNotify(true)
        setMessage('Ошибка: введите название категории')
        return
      }else {
        const req = await fetch('/api/categories/create', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({title})
        })
        const res = await req.json()
        if(res.ok){
          setIsNotify(true)
          setMessage(res.message)
          setOpenMenu(false)
          window.document.body.style.overflow = 'unset'
          setCategories(prevState => [...prevState, res.data])
        }else {
          setIsNotify(true)
          setMessage(`Ошибка: ${res.message}`)
        }
      }
    })
  }
  return <motion.div layout className='flex flex-col gap-2.5'>
    <InputPunishment props={{placeholder:'Название категории', pending:pending, id:'titleCreateInputId', name:'titleCreateInput', reason:title, setReason:setTitle}}/>
    <button onClick={()=>createCategories()} disabled={pending} className='bg-orange-500 dark:bg-orange-600 w-full py-1.25 rounded-md font-medium hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 transition-colors duration-300 ease-out disabled:bg-neutral-300 dark:disabled:bg-neutral-700 text-white cursor-pointer disabled:cursor-default select-none'>{pending?'Создаем':'Создать'}</button>
  </motion.div>
}