import {motion} from 'framer-motion'
import useOpenMenuAdminsPanel from '@/hooks/useOpenMenuAdminsPanel'
import React from 'react'
import AvatarUser from '@/components/shared/users/AvatarUser'
import ColorNicknameUser from '@/components/shared/users/ColorNicknameUser'
import {IUsers} from '@/components/ui/adminspanels/AvatarManagement'
import {IBans, IUnbans, IUnwarns, IWarns} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'

export default function CardUsersAdminsPanel({props, bans, warns}: { props:IUsers, bans:(IBans & { Unbans: IUnbans | null; })[], warns:(IWarns & { Unwarns: IUnwarns | null; })[]}) {
  const {setIsOpen, setUser} = useOpenMenuAdminsPanel()
  return <motion.div onClick={()=> {
    setIsOpen(true);
    setUser({id:props.id, login:props.login, role:props.role, avatar:props.avatar, bans:bans, warns:warns})
  }} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} layout transition={{duration:0.4}} className='w-full flex flex-row items-center gap-2.5 border p-2.5 rounded-md border-neutral-300 dark:border-neutral-700 cursor-pointer transition-colors duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-700'>
    <AvatarUser props={{role:props.role, avatar:props.avatar, width:48, height:48}}/>
    <ColorNicknameUser user={{login:props.login, role:props.role}} fontSize={16} fontWeight={600}/>
  </motion.div>
}