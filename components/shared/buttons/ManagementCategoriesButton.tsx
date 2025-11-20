import React from 'react'
import MenuWindow from '@/components/ui/menus/MenuWindow'
import ContentMenuCategories from '@/components/shared/ManagementCategories/ContentMenuCategories'
import OpenMenuAdminsPanelProvider from '@/components/providers/OpenMenuAdminsPanelProvider'
import {AnimatePresence} from 'framer-motion'

export default function ManagementCategoriesButton() {
  const [openMenuManagementC, setOpenMenuManagementC] = React.useState<boolean>(false)
  const [pending, setPending] = React.useTransition()
  return <div>
    <button onClick={()=>setOpenMenuManagementC(true)} className='cursor-pointer bg-orange-500 dark:bg-orange-600 font-medium p-1.25 rounded-md hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 transition-colors duration-300 ease-out text-white'>Управление категориями</button>
    <OpenMenuAdminsPanelProvider>
      <AnimatePresence>
        {openMenuManagementC && <MenuWindow props={{setIsOpenMenu:setOpenMenuManagementC, isOpenMenu:openMenuManagementC, pending:pending, content:<ContentMenuCategories pending={pending} setPending={setPending} setOpenMenu={setOpenMenuManagementC}/> }}/>}
      </AnimatePresence>
    </OpenMenuAdminsPanelProvider>
  </div>
}