import {ICategories} from '@/context/CategoriesContext'
import React from 'react'
import DeleteSubCategoriesCard from '@/components/shared/subCategories/DeleteSubCategoriesCard'

export default function DeleteSubCategories({props, setPending, pending}:{props:ICategories, setPending:React.TransitionStartFunction, pending:boolean}) {
  return <div className='flex flex-row'>
    <div className='flex flex-col max-h-30.5 overflow-y-auto w-full border rounded-md border-neutral-300 dark:border-neutral-700 divide-neutral-300 dark:divide-neutral-700 divide-y'>
      {props.subCategories.length>0?props.subCategories.map((sub)=>(
        <DeleteSubCategoriesCard key={sub.id} props={sub} pending={pending} setPending={setPending}/>
      )):
      <p className='text-center py-2.5 text-neutral-700 dark:text-neutral-300 font-medium'>Разделов нет</p>}
    </div>
  </div>
}