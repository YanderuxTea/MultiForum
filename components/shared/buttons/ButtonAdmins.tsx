import Link from 'next/link'
import ShieldIcon from '@/components/shared/icons/ShieldIcon'
import useHeader from '@/hooks/useHeader'

export default function ButtonAdmins() {
  const {setIsOpenMenu} = useHeader()
  return <Link href={'/adminsPanel/main'} onClick={()=>setIsOpenMenu(false)} className='w-full justify-end flex flex-row font-medium transition-colors duration-300 ease-out group text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 active:text-neutral-900 dark:hover:text-neutral-200 dark:active:text-neutral-100'>
    <p className='w-full'>Администрирование</p>
    <span className='w-6 h-6'>
      <ShieldIcon/>
    </span>
  </Link>
}