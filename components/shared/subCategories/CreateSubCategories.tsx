import InputPunishment from '@/components/shared/inputs/InputPunishment'
import React, {useState} from 'react'
import useNotify from '@/hooks/useNotify'
import {ICategories} from '@/context/CategoriesContext'
import useCategories from '@/hooks/useCategories'
import SelectIconSubCategories from '@/components/shared/subCategories/SelectIconSubCategories'

export default function CreateSubCategories({pending, props, setPending, setOpenMenu}:{pending:boolean, props:ICategories, setPending:React.TransitionStartFunction, setOpenMenu:React.Dispatch<React.SetStateAction<boolean>>}) {
  const [title, setTitle] = useState('')
  const [selectIcon, setSelectIcon] = useState('')
  const [openSelect ,setOpenSelect] = useState(false)
  const {setIsNotify, setMessage} = useNotify()
  const {setCategories} = useCategories()
  async function createSubCategories(){
    if (selectIcon.trim().length === 0 || title.trim().length === 0) {
      setIsNotify(true)
      setMessage(`Ошибка: выберите иконку или напишите название раздела`)
      return
    }else {
      setPending(async ()=>{
        const req = await fetch('/api/subCategories/create', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({title: title, selectIcon: selectIcon, id:props.id}),
        })
        const res = await req.json()
        if(res.ok){
          setIsNotify(true)
          setMessage(res.message)
          setCategories(prevState => prevState.map((category)=>{
            if(category.id !== props.id){
              return category
            }
            const updatedCategory = [...category.subCategories, res.sub]
            return {
              ...category,
              subCategories: updatedCategory
            }
          }))
          setOpenMenu(false)
          window.document.body.style.overflow = 'unset'
        }else {
          setIsNotify(true)
          setMessage(res.message)
        }
      })
    }
  }

  return <div className='flex flex-col gap-2.5'>
    <InputPunishment props={{placeholder:'Название раздела', id:'titleSubId', name:'titleSub', pending:pending, setReason:setTitle, reason:title}}/>
    <div className='flex flex-row items-center w-full justify-start gap-2.5'>
      <SelectIconSubCategories setSelectIcon={setSelectIcon} selectIcon={selectIcon} openSelect={openSelect} setOpenSelect={setOpenSelect} pending={pending}/>
      <div>
        <p className='text-balance'>Выберите иконку для раздела</p>
      </div>
    </div>
    <button disabled={pending} onClick={()=>createSubCategories()} className='bg-green-500 dark:bg-green-600 transition-colors duration-300 ease-out hover:bg-green-400 dark:hover:bg-green-500 active:bg-green-600 dark:active:bg-green-700 py-1.25 cursor-pointer disabled:cursor-default rounded-md text-white font-medium disabled:bg-neutral-300 dark:disabled:bg-neutral-700 select-none'>Создать</button>
  </div>
}