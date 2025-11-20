import {ICategories} from '@/context/CategoriesContext'
import React from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import Arrow from '@/components/shared/icons/Arrow'
import IconsManagementSubCategories from '@/components/shared/icons/IconsManagementSubCategories'
import useCheckingStaff from '@/hooks/useCheckingStaff'
import useDataUser from '@/hooks/useDataUser'
import MenuWindow from '@/components/ui/menus/MenuWindow'
import SubCategoriesMenuContent from '@/components/shared/subCategories/SubCategoriesMenuContent'
import OpenMenuAdminsPanelProvider from '@/components/providers/OpenMenuAdminsPanelProvider'
import SubCategoriesCard from '@/components/shared/subCategories/SubCategoriesCard'

export default function CategoriesMain({props}:{props:ICategories}) {
  const [open, setOpen] = React.useState(true);
  const userData = useDataUser()
  const {isAdmin} = useCheckingStaff({role:userData?userData.role:'User'})
  const [pending, setPending] = React.useTransition()
  const [openMenu, setOpenMenu] = React.useState(false);
  return <div className='bg-white dark:bg-[#212121] flex-col flex rounded-md border border-neutral-300 dark:border-neutral-700'>
    <AnimatePresence>
      {isAdmin&&openMenu&&
        <OpenMenuAdminsPanelProvider>
          <MenuWindow props={{setIsOpenMenu: setOpenMenu, isOpenMenu:openMenu, content: <SubCategoriesMenuContent setOpenMenu={setOpenMenu} props={props} setPending={setPending} pending={pending}/>, pending:pending}}/>
        </OpenMenuAdminsPanelProvider>
      }
    </AnimatePresence>
    <div className={`transition-colors duration-300 ease-out flex flex-row items-center justify-between font-medium md:text-lg dark:bg-orange-600 rounded-t-md p-2.5 border-neutral-300 dark:border-neutral-700 ${open?'border-b text-neutral-900 dark:text-neutral-100':'text-neutral-600 dark:text-neutral-300 rounded-md dark:bg-orange-700'}`}>
      <p className='transition-colors duration-300 ease-out'>{props.title}</p>
      <div className='flex flex-row items-center gap-1.25'>
        <button onClick={()=>setOpen(!open)} className={`transition-all duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md cursor-pointer ${open?'rotate-0':'rotate-90'}`}><Arrow/></button>
        {isAdmin&&<button onClick={() => setOpenMenu(true)} className='cursor-pointer'><IconsManagementSubCategories/></button>}
      </div>
    </div>
    <AnimatePresence>
      {open&&
      <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className={`flex flex-col overflow-clip ${props.subCategories.length===0&&'items-center'}`}>
        {props.subCategories.length>0?
          <div className='flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700'>
            {props.subCategories.map((sub) => (
                <SubCategoriesCard key={sub.id} props={sub}/>
            ))}
          </div>
          :
          <p className='text-neutral-700 dark:text-neutral-300 font-medium py-2.5'>Разделов нет :(</p>
        }
      </motion.div>
      }
    </AnimatePresence>
  </div>
}