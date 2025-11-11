import ColorNicknameUser from '@/components/shared/users/ColorNicknameUser'
import AvatarUser from '@/components/shared/users/AvatarUser'
import CheckBanned from '@/components/shared/users/CheckBanned'
import CheckNameplateUser from '@/components/shared/users/CheckNameplateUser'
import React from 'react'
import useOpenMenuAdminsPanel from '@/hooks/useOpenMenuAdminsPanel'

export default function UserInfo({banned}:{banned:boolean}) {
  const {login, role, avatar} = useOpenMenuAdminsPanel()
  return <div className='flex flex-col items-center gap-2.5'>
    <ColorNicknameUser user={{login:login, role:role}} fontSize={18} fontWeight={700}/>
    <AvatarUser props={{avatar:avatar, role:role, width:128, height:128}}/>
    {banned && <CheckBanned/>}
    <CheckNameplateUser role={role}/>
  </div>
}