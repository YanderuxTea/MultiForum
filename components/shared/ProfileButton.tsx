import Link from 'next/link'
import useDataUser from '@/hooks/useDataUser'
import useHeader from '@/hooks/useHeader'
import IconUserAvatar from '@/components/shared/icons/IconUserAvatar'

export default function ProfileButton() {
  const dataUser = useDataUser()
  const {setIsOpenMenu} = useHeader()
  return <Link href={`/profile/${dataUser&&dataUser.login}`} onClick={()=>setIsOpenMenu(false)} className='flex flex-row gap-1 justify-end lg:justify-between py-1 font-medium transition-colors duration-300 ease-out group text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 active:text-neutral-900 dark:hover:text-neutral-200 dark:active:text-neutral-100'>Профиль <IconUserAvatar/></Link>
}