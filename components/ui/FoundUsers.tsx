'use client'
import FoundUsersCard from '@/components/shared/FoundUsersCard'
import {useEffect, useMemo, useState} from 'react'
import Arrow from '@/components/shared/icons/Arrow'

export interface IFoundUsers{
  login: string,
  avatar: string|null,
  role:string
}
interface IUsers{
  users: IFoundUsers[]|[]
}
export default function FoundUsers({users}: IUsers ) {
  const [pageUsers, setPageUsers] = useState<IFoundUsers[]>([])
  const [pageNumber, setPageNumber] = useState<number>(0)
  const totalPages = useMemo(()=>{
    return Math.ceil(users.length / 5)
  }, [users.length])
  useEffect(() => {
    setPageNumber(0)
    setPageUsers(users.slice(pageNumber*5, pageNumber*5+5))
  }, [users])
  useEffect(() => {
    setPageUsers(users.slice(pageNumber*5, pageNumber*5+5))
  }, [pageNumber])
  return <>
    <div className={`flex flex-col gap-2.5 lg:px-2.5 relative h-87.5 lg:h-117.5 ${pageUsers.length===0&&'justify-center'}`}>
      {pageUsers.length === 0?<p className='text-neutral-700 text-center text-balance font-medium dark:text-neutral-300'>Пользователей с таким никнеймом нет</p>:
        pageUsers.map(user => (<FoundUsersCard key={user.login} user={user}/>))}
    </div>
    <div className='flex flex-row w-full items-center justify-between lg:px-2.5'>
      <div className='flex flex-row gap-1.25 items-center'>
        <button onClick={()=>setPageNumber(prevState => prevState !==0 ? prevState-1:prevState)} disabled={pageNumber===0} className='disabled:cursor-default disabled:hover:bg-neutral-400/50 disabled:active:bg-neutral-400/50 disabled:bg-neutral-400/50 group rotate-90 border rounded-md border-neutral-300 dark:border-neutral-700 cursor-pointer bg-white dark:bg-[#212121] transition-colors duration-300 ease-out hover:bg-neutral-300 hover:dark:bg-neutral-700 active:bg-neutral-400 dark:active:bg-neutral-800'><Arrow/></button>
        <p className='w-7.5 text-center select-none'>{pageNumber+1}</p>
        <button onClick={()=>setPageNumber(prevState => prevState+1<totalPages?prevState+1:prevState)} disabled={pageNumber+1>=totalPages} className='disabled:cursor-default disabled:hover:bg-neutral-400/50 disabled:active:bg-neutral-400/50 disabled:bg-neutral-400/50 -rotate-90 group border rounded-md border-neutral-300 dark:border-neutral-700 cursor-pointer bg-white dark:bg-[#212121] transition-colors duration-300 ease-out hover:bg-neutral-300 hover:dark:bg-neutral-700  active:bg-neutral-400 dark:active:bg-neutral-800'><Arrow/></button>
      </div>
      <p className='text-end text-neutral-600 dark:text-neutral-400'>Всего результатов: <span className='font-medium'>{users.length}</span></p>
    </div>
  </>

}