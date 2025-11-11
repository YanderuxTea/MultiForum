'use client'
import FoundUsersCard from '@/components/shared/searches/FoundUsersCard'
import {useEffect, useMemo, useState} from 'react'
import Pagination from '@/components/shared/Pagination'

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
    <div className={`flex flex-col gap-2.5 relative h-87.5 lg:h-117.5 ${pageUsers.length===0&&'justify-center'}`}>
      {pageUsers.length === 0?<p className='text-neutral-700 text-center text-balance font-medium dark:text-neutral-300'>Пользователей с таким никнеймом нет</p>:
        pageUsers.map(user => (<FoundUsersCard key={user.login} user={user}/>))}
    </div>
    <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalPages={totalPages} count={users.length}/>
  </>

}