'use client'
import {useSearchParams} from 'next/navigation'
import {roleManagementData} from '@/data/roleManagementData'
import SearchParamsCardAdminsPanel from '@/components/shared/adminspanels/SearchParamsCardAdminsPanel'
import {useEffect, useMemo, useState, useTransition} from 'react'
import CardUsersAdminsPanel from '@/components/shared/adminspanels/CardUsersAdminsPanel'
import Pagination from '@/components/shared/Pagination'
import {AnimatePresence, motion} from 'framer-motion'
import InputForSearchAdminsPanels from '@/components/shared/inputs/InputForSearchAdminsPanels'
import MenuWindow from '@/components/ui/menus/MenuWindow'
import useOpenMenuAdminsPanel from '@/hooks/useOpenMenuAdminsPanel'
import StubRoleManagementCards from '@/components/shared/stubs/StubRoleManagementCards'
import ContentMenuRoleManagement from '@/components/shared/adminspanels/ContentMenuRoleManagement'

export interface IUserRoleManagement {
  id: string,
  login: string,
  avatar?: string,
  role: string,
}
export default function ManagementRolesPanel() {
  const searchParams = useSearchParams().get('searchParams');
  const [users, setUsers] = useState<IUserRoleManagement[]>([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useTransition()
  const [pending, setPending] = useTransition()
  const usersByRole = useMemo(()=>{
    const roleParam = searchParams?.toLowerCase().trim().slice(0, searchParams?.length -1)
    return users.filter((user) => user.role.toLowerCase() ===roleParam);
  },[searchParams,users])
  const usersAfterSearch = useMemo(()=>{
    if(query.trim().length === 0){
      return usersByRole
    }
    return usersByRole.filter((user)=>user.login.toLowerCase().startsWith(query.toLowerCase().trim()))
  },[usersByRole, query])
  const totalPages = useMemo(() => {
    return Math.ceil(usersAfterSearch.length / 5)
  },[usersAfterSearch.length])
  const pageUsers = useMemo(()=>{
    return usersAfterSearch.slice(pageNumber*5, pageNumber*5+5)
  },[usersAfterSearch, pageNumber])
  const countUsers = useMemo(()=>{
    return users.reduce((acc, current) => {
      const role = current.role.toLowerCase()
      if(role in acc){
        acc[role as keyof typeof acc] += 1;
      }
      return acc;
    }, {user: 0, moderator: 0, admin: 0})
  },[users])
  useEffect(()=>{
    async function getUsers(){
      setLoading(async ()=>{
        const req = await fetch('/api/getDataRoleManagement',{
          method: 'GET',
        })
        const data = await req.json()
        if(data.ok){
          setUsers(data.users)
        }
      })
    }
    getUsers()
  },[])
  useEffect(() => {
    setPageNumber(0)
  }, [query, searchParams])
  const {isOpen, setIsOpen, role, login, avatar, id, setIsOpenList} = useOpenMenuAdminsPanel()
  return <div className='flex flex-col bg-white dark:bg-[#212121]  border rounded-md border-neutral-300 dark:border-neutral-700 p-5 gap-5 w-full'>
    <AnimatePresence>
      {isOpen&&<MenuWindow props={{setIsOpenMenu:setIsOpen, setIsHelp:setIsOpenList, content:<ContentMenuRoleManagement props={{avatar:avatar, login:login, id:id, role:role}} setUser={setUsers} users={users} pending={pending} setPending={setPending}/>, pending:pending}}/>}
    </AnimatePresence>
    <div className='flex flex-col gap-2.5'>
      {roleManagementData.map((item, index) => {return <SearchParamsCardAdminsPanel key={index} props={item} count={countUsers}/>})}
    </div>
    <InputForSearchAdminsPanels props={{query: query, setQuery: setQuery}}/>
    <div className={`flex flex-col gap-2.5 h-97.5 overflow-clip ${pageUsers.length===0&&'justify-center items-center'}`}>
      <AnimatePresence>
        {loading?[...Array(5)].map((_,index)=>{return <StubRoleManagementCards key={index}/>}):pageUsers?.length > 0 ? pageUsers.map((item)=>{return<CardUsersAdminsPanel key={item.id} props={item} warns={[]} bans={[]}/>}):
          <motion.p initial={{opacity:0,y:200}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.4}} layout className='w-full text-center font-medium text-neutral-900 dark:text-neutral-100'>Пользователей нет</motion.p>}
      </AnimatePresence>
    </div>
    <Pagination pageNumber={pageNumber} count={usersAfterSearch.length} totalPages={totalPages} setPageNumber={setPageNumber}/>
  </div>
}