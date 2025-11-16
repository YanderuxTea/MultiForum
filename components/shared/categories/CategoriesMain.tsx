import {ICategories} from '@/context/CategoriesContext'
import React from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import Arrow from '@/components/shared/icons/Arrow'

export default function CategoriesMain({props}:{props:ICategories}) {
  const [open, setOpen] = React.useState(true);
  return <div className='bg-white dark:bg-[#212121] flex-col flex p-2.5 rounded-md'>
    <div className='flex flex-row justify-between text-neutral-900 dark:text-neutral-100 font-medium md:text-lg'>
      <p>{props.title}</p>
      <button onClick={()=>setOpen(!open)} className={`aspect-square transition-all duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-md cursor-pointer ${open?'rotate-0':'rotate-90'}`}><Arrow/></button>
    </div>
    <AnimatePresence>
      {open&&
      <motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className={`flex flex-col overflow-clip ${props.subCategories.length===0&&'items-center'}`}>
        {props.subCategories.length>0?
          null
          :
          <p className='text-neutral-700 dark:text-neutral-300 font-medium'>Разделов нет :(</p>
        }
      </motion.div>
      }
    </AnimatePresence>
  </div>
}