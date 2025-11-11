import React from 'react'

export default function InputForSearchAdminsPanels({props}:{ props: {query: string, setQuery: React.Dispatch<React.SetStateAction<string>>} }) {
  return <div className='relative'>
    <input type='text' value={props.query} onChange={(e)=>props.setQuery(e.target.value.trim())} placeholder='Поиск пользователя' className='border p-1.25 rounded-md border-neutral-500 dark:border-neutral-500 outline-none w-full bg-white dark:bg-[#212121] relative z-1 peer' autoComplete={'off'} name='searchUsersRoleManagement'/>
    <span className='absolute inset-0 z-0 rounded-md outline-1 blur-[5px] outline-neutral-900 dark:outline-neutral-100 transition-opacity duration-300 ease-out opacity-0 peer-focus:opacity-100'></span>
  </div>
}