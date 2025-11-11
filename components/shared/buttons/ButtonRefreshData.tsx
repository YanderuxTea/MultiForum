import {motion, useAnimation} from 'framer-motion'
import RefreshIcon from '@/components/shared/icons/RefreshIcon'
import {useTransition} from 'react'
import useNotify from '@/hooks/useNotify'
import {useRouter} from 'next/navigation'

export default function ButtonRefreshData() {
  const controls = useAnimation();
  const [loading, setLoading] = useTransition()
  const {setMessage, setIsNotify} = useNotify()
  const router = useRouter()
  async function handleClick(){
    await controls.start({
      rotate:360,
    })
    controls.set({rotate:0})
    setLoading(async ()=>{
      const req = await fetch('/api/refreshData',{
        method: 'GET',
      })
      const res = await req.json()
      if(res.status === 404){
        router.push('/invalid')
      }
      if(res.ok){
        setIsNotify(true)
        setMessage(res.message)
        window.location.reload()
      }else {
        setIsNotify(true)
        setMessage(`Ошибка: ${res.error}`)
      }
    })
  }
  return <motion.button disabled={loading} transition={{duration:1, type:'spring', bounce:0.5}} animate={controls} onClick={()=>handleClick()} className='cursor-pointer group'><RefreshIcon/></motion.button>
}