'use client'
import {settingsList} from '@/data/settingsList'
import Link from 'next/link'
import {useParams} from 'next/navigation'
import {AnimatePresence, motion} from 'framer-motion'

export default function SettingsList() {
  const params = useParams()
  return<div className='max-h-max flex flex-col bg-white dark:bg-[#212121] max-w-300 w-full lg:max-w-max gap-5 p-5 border border-neutral-300 dark:border-neutral-700 rounded-md'>
      {settingsList.map((setting, index) => {
        return <Link className={`font-medium relative max-w-max transition-colors hover:text-neutral-800 dark:hover:text-neutral-200 duration-300 ease-out ${params.type === setting.url?'text-neutral-900 dark:text-neutral-100':'text-neutral-700 dark:text-neutral-300'}`} key={index} href={`/settings/${setting.url}`}>{setting.title}
          <AnimatePresence>
            {params.type===setting.url&&<motion.span initial={{opacity:0, scaleX:0}} animate={{opacity:1, scaleX:1}} exit={{opacity:0, scaleX:0}} className='absolute inset-x-0 h-0.5 bg-neutral-900 dark:bg-neutral-100 bottom-0'></motion.span>}
          </AnimatePresence>
        </Link>
      })}
    </div>
}