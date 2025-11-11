import useOpenMenuAdminsPanel from '@/hooks/useOpenMenuAdminsPanel'
import ColorNicknameUser from '@/components/shared/users/ColorNicknameUser'
import AvatarUser from '@/components/shared/users/AvatarUser'
import CheckNameplateUser from '@/components/shared/users/CheckNameplateUser'
import {IUsers} from '@/components/ui/adminspanels/AvatarManagement'
import React from 'react'

export default function ContentMenuAvatarManagement({setUsers, users, pending, setPending}:{setUsers:React.Dispatch<React.SetStateAction<IUsers[]>>, users:IUsers[], pending:boolean, setPending:React.TransitionStartFunction}) {
  const {login, avatar, id, role, setIsOpen} = useOpenMenuAdminsPanel()
  async function deleteAvatar(){
    setPending(async ()=>{
      const req = await fetch('/api/deleteUserAvatar',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id:id})
      })
      const res = await req.json()
      if(res.ok){
        const newArray = users.map((user)=>{
          if(user.id === id){
            return {
              ...user,
              avatar:undefined
            }
          }
          return user
        })
        setUsers(newArray)
        setIsOpen(false)
      }
    })
  }
  return <div className='flex flex-col gap-5 items-center'>
    <p className='mt-2.5 font-bold text-lg text-center'>Удаление аватарки пользователя</p>
    <div className='flex flex-col gap-2.5 items-center'>
      <ColorNicknameUser user={{login:login, role:role}} fontSize={18} fontWeight={700}/>
      <AvatarUser props={{avatar:avatar, role:role, width:128, height:128}}/>
      <CheckNameplateUser role={role}/>
    </div>
    <button onClick={!pending?()=>deleteAvatar():undefined} disabled={pending} className='font-medium text-white bg-red-600 dark:bg-red-700 transition-colors duration-300 ease-out hover:bg-red-500 dark:hover:bg-red-600 active:bg-red-700 dark:active:bg-red-800 w-full rounded-md py-1.25 cursor-pointer disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700'>{pending?'Удаляем':'Удалить'}</button>
  </div>
}