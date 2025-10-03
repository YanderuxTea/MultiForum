import {useEffect, useState} from 'react'
export default function useCurrentWidth():number {
  const [currentWidth, setCurrentWidth] = useState<number>(0);
  useEffect(()=>{
    function handleResize(){
      setCurrentWidth(window.innerWidth);
    }
    setCurrentWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  },[])
  return currentWidth
}