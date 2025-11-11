'use client'
import Link from 'next/link'
import {IRoleManagementData} from '@/data/roleManagementData'
import {useSearchParams} from 'next/navigation'
import {AnimatePresence, motion} from 'framer-motion'

export default function SearchParamsCardAdminsPanel({props, count}: { props:IRoleManagementData, count?:{user:number, moderator:number, admin:number} }) {
  const searchParams = useSearchParams().get('searchParams')
  return <Link href={props.url} className='flex flex-row relative'>
    <div className={`flex flex-row relative z-1 transition-colors duration-300 font-medium ease-out ${searchParams===props.searchParams?'text-neutral-100 dark:text-neutral-200':'text-neutral-800 dark:text-neutral-200'}`}>
      {count&&<p className='w-10'>{count[props.searchParams.slice(0, props.searchParams.length-1) as keyof typeof count]}</p>}
      <p>{props.title}</p>
    </div>
    <AnimatePresence>
      {searchParams===props.searchParams&&<motion.span initial={{width:0}} animate={{width:'auto'}} exit={{width:0}} className='absolute -inset-1.25 bg-orange-500 dark:bg-orange-600 z-0 rounded-md '></motion.span>}
    </AnimatePresence>
  </Link>
}