'use client'
import {useEffect, useMemo, useState, useTransition} from 'react'
import InputForSearchAdminsPanels from '@/components/shared/inputs/InputForSearchAdminsPanels'
import Pagination from '@/components/shared/Pagination'
import {AnimatePresence, motion} from 'framer-motion'
import StubRoleManagementCards from '@/components/shared/stubs/StubRoleManagementCards'
import MenuWindow from '@/components/ui/menus/MenuWindow'
import useOpenMenuAdminsPanel from '@/hooks/useOpenMenuAdminsPanel'
import ContentMenuAvatarManagement from '@/components/shared/adminspanels/ContentMenuAvatarManagement'
import CardUsersAdminsPanel from '@/components/shared/adminspanels/CardUsersAdminsPanel'

export interface IUsers {
  id: string,
  login: string,
  avatar?: string,
  role: string
}
export default function DeleteUsersAvatar() {
  const [users, setUsers] = useState<IUsers[]>([])
  const [query, setQuery] = useState<string>('')
  const [pageNumber, setPageNumber] = useState<number>(0)
  const [loading, setLoading] = useTransition()
  const [pending, setPending] = useTransition()
  const usersAfterSearch = useMemo(()=>{
    if(query.trim().length === 0){
      return users
    }
    return users.filter((user)=>user.login.toLowerCase().trim().startsWith(query.trim().toLowerCase()))
  },[users, query])
  const usersPage = useMemo(() => {
    return usersAfterSearch.slice(pageNumber*5, pageNumber*5 + 5)
  },[usersAfterSearch, pageNumber])
  const countUsers = useMemo(()=>{
    if(query.trim().length === 0){
      return users.length
    }
    return usersAfterSearch.length
  },[usersAfterSearch])
  const totalPages = useMemo(()=>{
    return Math.ceil(usersAfterSearch.length / 5)
  },[usersAfterSearch])
  useEffect(() => {
    async function getUsers(){
      setLoading(async ()=>{
        const req = await fetch('/api/getUsersAvatarManagement',{
          method: 'GET',
        })
        const res = await req.json()
        setUsers(res.users)
      })
    }
    getUsers()
  }, [])
  useEffect(() => {
    setPageNumber(0)
  }, [query])
  const {isOpen, setIsOpen} = useOpenMenuAdminsPanel()
  return <div className='bg-white dark:bg-[#212121] border border-neutral-300 dark:border-neutral-700 rounded-md p-5 flex flex-col gap-5 w-full'>
    <AnimatePresence>
      {isOpen&&<MenuWindow props={{setIsOpenMenu: setIsOpen, isOpenMenu:isOpen, content: <ContentMenuAvatarManagement setUsers={setUsers} users={users} setPending={setPending} pending={pending}/>, pending: pending}}/>}
    </AnimatePresence>
    <InputForSearchAdminsPanels props={{query:query, setQuery:setQuery}} />
    <div className={`flex flex-col gap-2.5 h-97.5 overflow-clip ${usersAfterSearch.length===0&&'justify-center items-center'}`}>
      <AnimatePresence>
        {loading?[...Array(5)].map((_,index)=>{return<StubRoleManagementCards key={index}/>}):usersPage.length>0?usersPage.map((user) => {return<CardUsersAdminsPanel props={user} key={user.id} warns={[]} bans={[]}/>}):
          <motion.p layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='w-full text-center font-medium text-neutral-900 dark:text-neutral-100'>Пользователей нет</motion.p>}
      </AnimatePresence>
    </div>
    <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalPages={totalPages} count={countUsers}/>
  </div>
}