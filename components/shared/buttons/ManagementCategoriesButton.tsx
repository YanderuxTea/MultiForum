import React, {useEffect} from 'react'
import MenuWindow from '@/components/ui/menus/MenuWindow'
import ContentMenuCategories from '@/components/shared/ManagementCategories/ContentMenuCategories'
import OpenMenuAdminsPanelProvider from '@/components/providers/OpenMenuAdminsPanelProvider'
import {AnimatePresence} from 'framer-motion'

export default function ManagementCategoriesButton() {
  const [openMenu, setOpenMenu] = React.useState<boolean>(false)
  const [pending, setPending] = React.useTransition()
  useEffect(() => {
    if(openMenu){
      document.body.style.overflow = 'hidden'
    }else {
      document.body.style.overflow = 'unset'
    }
  }, [openMenu])
  return <div>
    <button onClick={()=>setOpenMenu(true)} className='cursor-pointer bg-orange-500 dark:bg-orange-600 font-medium p-1.25 rounded-md hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 transition-colors duration-300 ease-out text-white'>Управление категориями</button>
    <OpenMenuAdminsPanelProvider>
      <AnimatePresence>
        {openMenu && <MenuWindow props={{setIsOpenMenu:setOpenMenu, pending:pending, content:<ContentMenuCategories pending={pending} setPending={setPending} setOpenMenu={setOpenMenu}/> }}/>}
      </AnimatePresence>
    </OpenMenuAdminsPanelProvider>
  </div>
}