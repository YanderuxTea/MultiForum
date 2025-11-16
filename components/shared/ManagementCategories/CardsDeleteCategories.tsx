import {ICategories} from '@/context/CategoriesContext'
import React from 'react'
import IconCheck from '@/components/shared/icons/IconCheck'

export default function CardsDeleteCategories({props, selectCategories, setSelectCategories, pending}:{props:ICategories, selectCategories:ICategories[], setSelectCategories:React.Dispatch<React.SetStateAction<ICategories[]>>, pending:boolean}) {
  function handleAddCategories(){
    if(selectCategories.includes(props)){
      setSelectCategories(prevState => prevState.filter(category => category !== props ))
    }else {
      setSelectCategories(prevState => [...prevState, props ])
    }
  }
  return <div className='flex flex-row items-center justify-between'>
    <p className='max-w-[80%] break-all'>{props.title}</p>
    <button disabled={pending} onClick={()=>handleAddCategories()} className={`transition-colors duration-300 ease-out border rounded-md w-8 aspect-square ${selectCategories.includes(props)?'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600':'border-neutral-300 dark:border-neutral-700'} flex items-center justify-center cursor-pointer disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700`}>{selectCategories.includes(props)&&
      <IconCheck/>}</button>
  </div>
}