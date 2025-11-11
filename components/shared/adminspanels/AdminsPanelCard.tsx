import {IAdminsPanelData} from '@/data/adminsPanelData'
import Link from 'next/link'
import {AnimatePresence, motion} from 'framer-motion'
import {useParams} from 'next/navigation'

export default function AdminsPanelCard({props}:{props:IAdminsPanelData}) {
  const currPanel = useParams()
  const checkCurrPanel = currPanel.panel===props.url
  return<Link href={`/adminsPanel/${props.url}`} className={`transition-colors duration-300 ease-out font-medium ${checkCurrPanel?'text-neutral-900 dark:text-neutral-100':'text-neutral-700 dark:text-neutral-300'}`}>
    <p className='relative max-w-max'>
      {props.title}
      <AnimatePresence>
        {checkCurrPanel&&<motion.span initial={{opacity:0, width:0}} animate={{opacity:1, width:'auto'}} exit={{opacity:0, width:0}} className='border-orange-500 dark:border-orange-600 translate-y-1.25 absolute inset-0 border-b-2 after:absolute after:inset-0 after:border-b-2 after:blur-[5px] after:content-[""] after:translate-y-0.5 after:border-orange-500 after:dark:border-orange-600'></motion.span>}
      </AnimatePresence>
    </p>
  </Link>
}