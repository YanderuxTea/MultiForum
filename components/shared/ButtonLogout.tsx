import {useRouter} from 'next/navigation'


export default function ButtonLogout() {
 const router = useRouter()
  async function handleLogout() {
    try {
      const res = await fetch('/api/logout', {
        method: 'GET',
      })
      const data = await res.json()
      if(data.ok){
        router.push('/')
        window.location.reload()
      }
    }catch (error) {
      console.log(error)
    }
  }
  return <button className='w-full py-1 border rounded-sm border-red-600 font-medium cursor-pointer transition-colors duration-300 ease-out hover:bg-red-600 hover:text-white active:bg-red-600 active:text-white select-none' onClick={()=>handleLogout()}>
    Выйти
  </button>
}