import Link from 'next/link'
import useHeader from '@/hooks/useHeader'

export default function ButtonLogin() {
  const {setIsOpenMenu} = useHeader();
  return <Link href={'/auth/login'} onClick={()=>setIsOpenMenu(false)} className='text-center h-max rounded-md py-1.25 bg-orange-500 dark:bg-orange-600 font-medium text-white px-2.5 transition-all duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 active:scale-90'>Войти в аккаунт</Link>
}