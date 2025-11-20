import {ISubCategories} from '@/context/CategoriesContext'
import useCheckIconSubCategory from '@/hooks/useCheckIconSubCategory'
import DeleteButton from '@/components/shared/buttons/DeleteButton'
import React from 'react'
import useNotify from '@/hooks/useNotify'
import useCategories from '@/hooks/useCategories'

export default function DeleteSubCategoriesCard({props, pending, setPending}:{props:ISubCategories, pending:boolean, setPending: React.TransitionStartFunction}) {
  const icon = useCheckIconSubCategory({props:props})
  const {setIsNotify, setMessage} = useNotify()
  const {setCategories} = useCategories()
  async function deleteSubCategories() {
    setPending(async ()=>{
      const req = await fetch('/api/subCategories/delete', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id: props.id, position:props.position}),
      })
      const res = await req.json()
      if(res.ok){
        setCategories(prevState => prevState.map((category)=>{
          if(category.id !== props.idCategories){
            return category
          }
          const updateSub = category.subCategories.filter((sub)=>sub.id !== props.id)
          return {
            ...category,
            subCategories:updateSub
          }
        }))
        setIsNotify(true)
        setMessage(res.message)
      }else {
        setIsNotify(true)
        setMessage(res.message)
      }
    })
  }
  return <div className='flex flex-row justify-between p-1.25 py-2.5'>
    <div className='flex flex-row gap-2.5 items-center'>
      <div className='bg-orange-500 dark:bg-orange-600 opacity-40 p-1.25 rounded-full'>
        {icon}
      </div>
      <p className='text-neutral-900 dark:text-neutral-100'>{props.title}</p>
    </div>
    <DeleteButton pending={pending} eventUsers={deleteSubCategories}/>
  </div>
}