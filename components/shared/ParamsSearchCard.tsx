'use client'
import React from 'react'

interface IProps{
  title: string,
  value: string,
  searchFilter?: string,
}
export default function ParamsSearchCard({title, value, searchFilter}: IProps) {

  return <label htmlFor={`params-${value}`} className='group cursor-pointer max-w-100'>
    <input type='radio' id={`params-${value}`} name='searchParams' value={value} defaultChecked={searchFilter?value===searchFilter:value==='All'} className='hidden'/>
    <div className='flex flex-row items-center gap-2.5 border p-1.25 rounded-md border-neutral-700 group-has-checked:bg-neutral-700 transition-colors duration-300 ease-out'>
      <div className='border w-2.5 aspect-square rounded-full border-neutral-700 group-has-checked:bg-green-500 group-has-checked:border-green-500 dark:group-has-checked:border-green-600 dark:group-has-checked:bg-green-600 transition-colors duration-300 ease-out'></div>
      <p className='text-neutral-800 dark:text-neutral-200 font-medium group-has-checked:text-white'>{title}</p>
    </div>
  </label>
}