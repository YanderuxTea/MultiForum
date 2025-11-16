import {managementCategoriesButtonsData} from '@/data/managementCategoriesButtonsData'
import SelectorChooseManagementCategories
  from '@/components/shared/ManagementCategories/SelectorChooseManagementCategories'
import React from 'react'
import CreateCategoriesPanel from '@/components/shared/ManagementCategories/CreateCategoriesPanel'
import DeleteCategoriesPanel from '@/components/shared/ManagementCategories/DeleteCategoriesPanel'
import EditCategoriesPanel from '@/components/shared/ManagementCategories/EditCategoriesPanel'
import {motion} from 'framer-motion'

export default function ContentMenuCategories({pending, setPending, setOpenMenu}: {pending: boolean, setPending: React.TransitionStartFunction, setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>}) {
  const [value, setValue] = React.useState<string>('create')
  const panel = value === 'create'?<CreateCategoriesPanel setOpenMenu={setOpenMenu} pending={pending} setPending={setPending}/>:value === 'delete'?<DeleteCategoriesPanel pending={pending} setPending={setPending} setOpenMenu={setOpenMenu}/>: value==='edit'?<EditCategoriesPanel pending={pending} setPending={setPending}/>:null
  return <motion.div layout className='w-full flex flex-col gap-2.5'>
    <motion.p layout className='mt-2.5 font-bold text-neutral-800 dark:text-neutral-200 text-lg text-center'>Управление категориями</motion.p>
    <motion.div layout className='flex flex-row justify-between border p-1.25 rounded-[11px] border-neutral-300 dark:border-neutral-700'>
      {managementCategoriesButtonsData.map((button, index)=>{return <SelectorChooseManagementCategories key={index} props={{title:button.title,value:button.value, setValue:setValue, valueState:value, pending:pending, setPending:setPending}}/>})}
    </motion.div>
    <motion.div layout>
      {panel}
    </motion.div>
  </motion.div>
}