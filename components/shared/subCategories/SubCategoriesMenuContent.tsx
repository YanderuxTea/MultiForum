import {ICategories} from '@/context/CategoriesContext'
import SelectorChooseManagementCategories
  from '@/components/shared/ManagementCategories/SelectorChooseManagementCategories'
import React from 'react'
import {managementCategoriesButtonsData} from '@/data/managementCategoriesButtonsData'
import CreateSubCategories from '@/components/shared/subCategories/CreateSubCategories'
import DeleteSubCategories from '@/components/shared/subCategories/DeleteSubCategories'
import EditSubCategories from '@/components/shared/subCategories/EditSubCategories'
import {motion} from 'framer-motion'

export default function SubCategoriesMenuContent({props,setPending, pending, setOpenMenu}:{props:ICategories, setPending:React.TransitionStartFunction, pending:boolean, setOpenMenu:React.Dispatch<React.SetStateAction<boolean>>}) {
  const [value, setValue] = React.useState('create')
  const panel = value === 'create'? <CreateSubCategories setOpenMenu={setOpenMenu} props={props} setPending={setPending} pending={pending}/> : value === 'delete' ? <DeleteSubCategories props={props} setPending={setPending} pending={pending}/> : value === 'edit'? <EditSubCategories pending={pending} setPending={setPending} props={props}/> : null
  return <div className='flex flex-col gap-2.5'>
    <motion.p layout className='mt-2.5 text-neutral-900 dark:text-neutral-100 text-center'>Изменение разделов категории <span className='font-bold'>{props.title}</span></motion.p>
    <motion.div layout className='flex flex-row justify-between border border-neutral-300 dark:border-neutral-700 p-1.25 rounded-[11px]'>
      {managementCategoriesButtonsData.map((button, index)=>{
        return <SelectorChooseManagementCategories key={index} props={{valueState:value, setValue:setValue, pending:pending, setPending:setPending, value:button.value, title:button.title}}/>
      })}
    </motion.div>
    <motion.div layout>
      {panel}
    </motion.div>
  </div>
}