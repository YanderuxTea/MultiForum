import Link from 'next/link'
import useHeader from '@/hooks/useHeader'

export default function Logo() {
  const {setIsOpenMenu} = useHeader();
  return <Link href={'/'} onClick={()=>setIsOpenMenu(false)} className='font-bold text-gray-600 text-2xl md:text-3xl dark:text-white'>MULTI FORUM</Link>
}