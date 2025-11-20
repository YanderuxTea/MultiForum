import {ISubCategories} from '@/context/CategoriesContext'
import React from 'react'
import SelectIconSubCategories from '@/components/shared/subCategories/SelectIconSubCategories'
import IconCheck from '@/components/shared/icons/IconCheck'
import useNotify from '@/hooks/useNotify'
import useCategories from '@/hooks/useCategories'

export default function EditSubCategoriesCard({props, setPending, pending}:{props:ISubCategories, setPending:React.TransitionStartFunction, pending:boolean}) {
  const {setIsNotify, setMessage} = useNotify()
  const {setCategories} = useCategories()
  async function editSubCategories(){
    setPending(async ()=>{
      if(newTitle.trim() === props.title && newSelectIcon.trim() === props.icon){
        setIsNotify(true)
        setMessage(`Ошибка: вы не изменили иконку или название`)
        return
      }
      const req = await fetch('/api/subCategories/edit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({newTitle:newTitle.trim(), newIcon:newSelectIcon.trim(), id:props.id}),
      })
      const res = await req.json()
      if(res.ok){
        setIsNotify(true)
        setMessage(res.message)
        setCategories(prevState => prevState.map((category)=>{
          if(category.id !== props.idCategories){
            return category
          }
          const updateSubCategory = category.subCategories.map((subCategory)=>{
            if(subCategory.id !== props.id){
              return subCategory
            }
            return {
              ...subCategory,
              title:newTitle,
              icon:newSelectIcon
            }
          })
          return {
            ...category,
            subCategories: updateSubCategory
          }
        }))
      }else {
        setIsNotify(true)
        setMessage(res.message)
      }
    })
  }
  const [newTitle, setNewTitle] = React.useState(props.title)
  const [newSelectIcon, setNewSelectIcon] = React.useState(props.icon)
  const [openSelect, setOpenSelect] = React.useState(false)
  return <div className='py-2.5 px-1.25 flex flex-row justify-between'>
    <SelectIconSubCategories selectIcon={newSelectIcon} setSelectIcon={setNewSelectIcon} openSelect={openSelect} setOpenSelect={setOpenSelect} pending={pending}/>
    <input type='text' id={props.id} disabled={pending} defaultValue={props.title} onChange={(e)=>setNewTitle(e.target.value)} className='outline-none border w-[70%] border-neutral-300 dark:border-neutral-700 rounded-md px-1.25 focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors duration-300 ease-out'/>
    <button onClick={()=>editSubCategories()} disabled={pending} className='cursor-pointer transition-colors duration-300 ease-out hover:bg-green-400 dark:hover:bg-green-500 active:bg-green-600 dark:active:bg-green-700 flex items-center justify-center bg-green-500 dark:bg-green-600 p-1.25 rounded-md disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 select-none'><IconCheck/></button>
  </div>
}