'use client'
import React, {useEffect, useMemo, useState} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import VerifyButton from '@/components/shared/buttons/VerifyButton'
import DeleteButton from '@/components/shared/buttons/DeleteButton'
import StubLoadingVerifyPanel from '@/components/shared/stubs/StubLoadingVerifyPanel'
import Pagination from '@/components/shared/Pagination'

export default function VerifyUsersPanel() {
  const [users, setUsers] = React.useState<{id:string, login:string, email: string}[]>([])
  const [usersPage, setUsersPage] = React.useState<{id:string, login:string, email: string}[]>([])
  const [pageNumber, setPageNumber] = useState<number>(0)
  const totalPages = useMemo(()=>{return Math.ceil(users.length / 5)}, [users.length])
  const [loading, setLoading] = React.useTransition()
  const [pending, setPending] = React.useTransition()
  async function eventUsers(id: string, type:string){
    setPending(async ()=>{
      const req = await fetch('/api/verificationUsers', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ id:id, type:type }),
      })
      const res = await req.json()
      if(res.ok){
        setUsers(users.filter(user => user.id !== id))
        setUsersPage(users.filter(user => user.id !== id).slice(pageNumber*5, pageNumber*5 +5))
      }
    })
  }
  useEffect(() => {
    async function getUnverifyUsers(){
      setLoading(async ()=>{
        const req = await fetch('/api/getUnverifyUsers',
          {
            method:'GET',
          })
        const data = await req.json()
        setUsers(data.users)
        setUsersPage(data.users.slice(pageNumber, pageNumber + 5))
      })
    }
    getUnverifyUsers()
  }, [])
  useEffect(() => {
    setUsersPage(users.slice(pageNumber*5, pageNumber*5 + 5))
  }, [pageNumber])
  useEffect(() => {
    if(totalPages>=1 && usersPage.length === 0){
      setPageNumber(prevState => prevState - 1)
    }
  }, [totalPages])
  return <div className='flex flex-col p-5 gap-5 bg-white dark:bg-[#212121] rounded-md border border-neutral-300 dark:border-neutral-700 w-full'>
    <div className={`flex flex-col gap-1.25 h-111.25 overflow-clip ${users.length===0&&'justify-center'}`}>
      <AnimatePresence>
      {users.length > 0 ?usersPage.map((user) =>
          {return <motion.div key={user.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} layout className='border px-2.5 py-1.25 rounded-md border-neutral-300 dark:border-neutral-700 flex flex-row justify-between gap-2.5 items-center'>
            <div className='flex flex-col w-[80%]'>
              <p className='font-bold text-neutral-900 dark:text-neutral-100'>{user.login}</p>
              <p className='text-neutral-700 dark:text-neutral-300 whitespace-nowrap text-ellipsis overflow-clip text-sm'>{user.email}</p>
            </div>
            <div className='flex flex-col gap-1.25'>
              <VerifyButton pending={pending} eventUsers={()=>eventUsers(user.id, 'verify')}/>
              <DeleteButton pending={pending} eventUsers={()=>eventUsers(user.id, 'delete')}/>
            </div>
          </motion.div>}
        ): loading
        ? [...Array(5)].map((_, index)=>{return <StubLoadingVerifyPanel key={index}/>})
        : <motion.p layout initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='w-full text-center font-medium text-neutral-900 dark:text-neutral-100'>Нет пользователей</motion.p>}
      </AnimatePresence>
    </div>
    <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalPages={totalPages} count={users.length}/>
  </div>
}