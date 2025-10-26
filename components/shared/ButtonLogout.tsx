import {useRouter} from 'next/navigation'
import LogoutIcon from '@/components/shared/icons/LogoutIcon'


export default function ButtonLogout() {
 const router = useRouter()
  async function handleLogout() {
    try {
      const res = await fetch('/api/logout', {
        method: 'GET',
      })
      const data = await res.json()
      if(data.status === 404) {
        router.push('/invalid')
      }
      if(data.ok){
        router.push('/')
        window.location.reload()
      }
    }catch (error) {
      console.log(error)
    }
  }
  return <button className='text-neutral-800 dark:text-neutral-100 flex flex-row w-full py-1 justify-end gap-1.25 rounded-sm font-bold cursor-pointer transition-colors duration-300 ease-out select-none active:text-red-600 hover:text-red-600 group lg:justify-between' onClick={()=>handleLogout()}>
    Выход
    <LogoutIcon/>
  </button>
}