import React, {useEffect, useRef} from 'react'
import {iconsSubCategories} from '@/data/iconsSubCategories'

export default function SelectIconSubCategories({setOpenSelect, openSelect, selectIcon, setSelectIcon, pending}:{selectIcon:string, setSelectIcon:React.Dispatch<React.SetStateAction<string>>,openSelect:boolean,setOpenSelect:React.Dispatch<React.SetStateAction<boolean>>, pending:boolean}) {
  const containerRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function handleClose(e:MouseEvent){
      if(containerRef.current&& !containerRef.current.contains(e.target as Node)){
        setOpenSelect(false)
      }
    }
    window.addEventListener('click', handleClose)
    return () => {window.removeEventListener('click', handleClose)}
  }, [])
  return <div onClick={pending?undefined:()=>setOpenSelect(prevState => !prevState)} ref={containerRef} className={`relative w-8.5 h-8.5 aspect-square border flex items-center justify-center border-neutral-400 bg-neutral-500 dark:border-neutral-700 dark:bg-neutral-900 rounded-md ${pending?'cursor-default':'cursor-pointer'}`}>
    {openSelect&&
      <div className='fixed z-1 bg-neutral-500 dark:bg-neutral-900 flex flex-col translate-y-26.25 rounded-md border border-neutral-400 dark:border-neutral-700'>
        {iconsSubCategories.map((icon) => {
          return <div
            className='p-2.5 cursor-pointer rounded-md transition-colors duration-300 ease-out hover:bg-neutral-600 dark:hover:bg-neutral-800'
            key={icon.value}
            onClick={()=>setSelectIcon(icon.value)}>
            {icon.icon}
          </div>
        })}
      </div>}
    {iconsSubCategories.map((icon) => {
      if(icon.value === selectIcon){
        return <div key={icon.value}>{icon.icon}</div>
      }
    })}
  </div>
}