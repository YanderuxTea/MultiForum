'use client'
import React, {useEffect, useMemo, useState, useTransition} from 'react'
import {useSearchParams} from 'next/navigation'
import Pagination from '@/components/shared/Pagination'
import InputForSearchAdminsPanels from '@/components/shared/inputs/InputForSearchAdminsPanels'
import CardUsersAdminsPanel from '@/components/shared/adminspanels/CardUsersAdminsPanel'
import {punishmentManagementData} from '@/data/punishmentManagementData'
import SearchParamsCardAdminsPanel from '@/components/shared/adminspanels/SearchParamsCardAdminsPanel'
import {AnimatePresence, motion} from 'framer-motion'
import useOpenMenuAdminsPanel from '@/hooks/useOpenMenuAdminsPanel'
import MenuWindow from '@/components/ui/menus/MenuWindow'
import StubRoleManagementCards from '@/components/shared/stubs/StubRoleManagementCards'
import ContentMenuPunishmentManagement from '@/components/shared/adminspanels/ContentMenuPunishmentManagement'
import {IUser} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'

export default function ManagementPunishmentPanel() {
  const [users, setUsers] = useState<IUser[]>([])
  const [pageNumber, setPageNumber] = useState<number>(0)
  const searchParams = useSearchParams().get('searchParams')
  const [query, setQuery] = useState('')
  const {isOpen, setIsOpen} = useOpenMenuAdminsPanel()
  const [loading, setLoading] = useTransition()
  const [pending, setPending] = useTransition()
  useEffect(() => {
    async function getUsers(){
      setLoading(async ()=>{
        const req = await fetch('/api/getUsersPunishmentManagement',{
          method: 'GET'
        })
        const res = await req.json()
        setUsers(res.users)
      })
    }
    getUsers()
  }, [])
  const activeBanned = useMemo(()=>{
    return users.filter((user)=>user.bans.some((userBan)=> {
      if(userBan.Unbans){
        return false
      }
      return new Date(userBan.date).getTime() + userBan.time * 60 * 1000 > Date.now() || userBan.time === 0
    }))
  },[users])
  const notBanned = useMemo(()=>{
    return users.filter((user)=>!activeBanned.includes(user))
  },[users, activeBanned])
  const totalPages = useMemo(()=>{
    return searchParams === 'unbanned' ? Math.ceil(notBanned.length/5) : Math.ceil(activeBanned.length/5)
  },[activeBanned, notBanned, searchParams])
  const userSearch = useMemo(()=>{
    if(query.trim().length === 0){
      return searchParams === 'unbanned' ? notBanned : activeBanned
    }
    return searchParams === 'unbanned'? notBanned.filter((user)=>user.login.toLowerCase().trim().startsWith(query.toLowerCase().trim())):activeBanned.filter((user)=>user.login.toLowerCase().trim().startsWith(query.toLowerCase().trim()))
  },[searchParams, activeBanned, notBanned, query])
  const usersPage = useMemo(()=>{
    return userSearch.slice(pageNumber*5, pageNumber*5 +5)
  },[pageNumber, userSearch])
  return <div className='bg-white p-5 rounded-md flex flex-col border border-neutral-300 dark:border-neutral-700 dark:bg-[#212121] w-full gap-5'>
    <AnimatePresence>
      {isOpen&&<MenuWindow props={{setIsOpenMenu:setIsOpen, content: <ContentMenuPunishmentManagement setUsers={setUsers} users={users} banned={searchParams==='banned'} setPending={setPending} pending={pending}/>, pending:pending}}/>}
    </AnimatePresence>
    <div className='flex flex-col gap-2.5'>
      {punishmentManagementData.map((card, index)=>{return <SearchParamsCardAdminsPanel key={index} props={{title:card.title, url:card.url, searchParams:card.searchParams}}/>})}
    </div>
    <InputForSearchAdminsPanels props={{query:query, setQuery:setQuery}}/>
    <div className={`flex flex-col gap-2.5 h-97.5 overflow-clip ${usersPage.length === 0 && 'justify-center items-center'}`}>
      <AnimatePresence>
        {loading?[...Array(5)].map((_,index)=>{return <StubRoleManagementCards key={index}/>}):usersPage.length > 0 ?
          usersPage.map((user)=>{return <CardUsersAdminsPanel key={user.id} props={{id:user.id, login:user.login, role:user.role, avatar:user.avatar}} bans={user.bans} warns={user.warns}/>})
          :
          <motion.p layout className='w-full text-center font-medium text-neutral-900 dark:text-neutral-100' initial={{opacity:0,y:200}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.4}}>Пользователей нет</motion.p>
        }
      </AnimatePresence>

    </div>
    <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalPages={totalPages} count={searchParams === 'unbanned' ? notBanned.length : activeBanned.length} />
  </div>
}