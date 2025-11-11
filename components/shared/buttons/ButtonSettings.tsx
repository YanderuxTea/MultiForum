import Link from 'next/link'
import SettingsIcon from '@/components/shared/icons/SettingsIcon'
import useHeader from '@/hooks/useHeader'

export default function ButtonSettings() {
  const {setIsOpenMenu} = useHeader()
  return <Link href={'/settings/main'} onClick={()=>setIsOpenMenu(false)} className='flex flex-row justify-end font-medium group transition-colors duration-300 ease-out text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 active:text-neutral-900 dark:hover:text-neutral-200 dark:active:text-neutral-100 lg:justify-between w-full text-left'>
    <p className='w-full'>Настройки</p>
    <span className='w-6 h-6'>
      <SettingsIcon/>
    </span>
  </Link>
}