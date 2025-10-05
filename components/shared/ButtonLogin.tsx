import Link from 'next/link'
import useHeader from '@/hooks/useHeader'

export default function ButtonLogin() {
  const {setIsOpenMenu} = useHeader();
  return <Link href={'/auth/login'} onClick={()=>setIsOpenMenu(false)} className='text-center rounded-md py-1.25 bg-orange-400 font-medium text-white px-2.5 transition-all duration-300 ease-out hover:bg-orange-500 active:scale-110'>Войти в аккаунт</Link>
}