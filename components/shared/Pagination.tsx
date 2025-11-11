import Arrow from '@/components/shared/icons/Arrow'
import React from 'react'

export default function Pagination({pageNumber, setPageNumber, totalPages, count}: {pageNumber: number, setPageNumber:  React.Dispatch<React.SetStateAction<number>>, totalPages: number, count: number}) {
  return <div className='flex flex-row justify-between'>
    <div className='flex flex-row gap-1.25 items-center'>
      <button disabled={pageNumber-1<0} onClick={()=>pageNumber-1>=0&&setPageNumber(prevState => prevState-1)} className='rotate-90 group rounded-md border border-neutral-300 dark:border-neutral-700 disabled:bg-neutral-200 transition-colors duration-300 ease-out cursor-pointer disabled:cursor-no-drop hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-800 dark:disabled:bg-neutral-600'><Arrow/></button>
      <p className='w-7.5 text-center select-none'>{pageNumber+1}</p>
      <button disabled={pageNumber+1>=totalPages} onClick={()=>pageNumber+1<totalPages&&setPageNumber(prevState => prevState+1)} className='-rotate-90 group rounded-md border border-neutral-300 dark:border-neutral-700 disabled:bg-neutral-200 transition-colors duration-300 ease-out cursor-pointer disabled:cursor-no-drop hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-800 dark:disabled:bg-neutral-600'><Arrow/></button>
    </div>
    <p className='text-neutral-600 dark:text-neutral-400 font-medium'>Всего: {count}</p>
  </div>
}