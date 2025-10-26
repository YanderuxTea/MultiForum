'use client'
import React, {useEffect} from 'react'

interface ITimeoutSearch {
  timeout: number,
}
export default function TimeoutSearch({timeout}:ITimeoutSearch) {
  const [timeoutState, setTimeoutState] = React.useState<number>(timeout);
  useEffect(() => {
    const interval = setInterval(()=>{
      if(timeoutState-1 !== 0){
        setTimeoutState(prevState => prevState-1)
      }else {
        clearInterval(interval)
      }
    },1000)
    return () => {clearInterval(interval)}
  },[])
  return <p className='font-bold text-neutral-900 dark:text-neutral-100'>{timeoutState>0?`Повторите попытку через ${timeoutState} секунд`:'Можете повторить запрос'}</p>
}