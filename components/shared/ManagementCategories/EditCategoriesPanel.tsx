import {motion} from 'framer-motion'
import useCategories from '@/hooks/useCategories'
import CardsEditCategory from '@/components/shared/ManagementCategories/CardsEditCategory'
import React from 'react'

export default function EditCategoriesPanel({pending, setPending}:{pending:boolean, setPending:React.TransitionStartFunction}) {
  const categories = useCategories()
  return <motion.div layout className='flex flex-col gap-2.5'>
    <p className='text-neutral-800 dark:text-neutral-200 text-center'>{categories.categories.length===0?'Категорий нет':'Нажмите на название категории для изменения'}</p>
    <div className='flex flex-col gap-2.5 max-h-52.5 overflow-y-auto'>
      {categories.categories.map((category)=>{
        return <CardsEditCategory pending={pending} setPending={setPending} props={category} key={category.id}/>
      })}
    </div>
  </motion.div>
}