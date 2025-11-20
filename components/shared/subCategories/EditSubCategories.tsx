import {ICategories} from '@/context/CategoriesContext'
import React from 'react'
import EditSubCategoriesCard from '@/components/shared/subCategories/EditSubCategoriesCard'

export default function EditSubCategories({props, setPending, pending}: {props:ICategories, setPending:React.TransitionStartFunction, pending:boolean}) {
  return <div className='overflow-y-scroll max-h-30.5 border border-neutral-300 dark:border-neutral-700 rounded-md divide-y divide-neutral-300 dark:divide-neutral-700'>
    {props.subCategories.length>0?props.subCategories.map(subCategory => {
     return <EditSubCategoriesCard key={subCategory.id} props={subCategory} setPending={setPending} pending={pending}/>
    }): <p className='text-center py-2.5 text-neutral-700 dark:text-neutral-300 font-medium'>Разделов нет</p>}
  </div>
}