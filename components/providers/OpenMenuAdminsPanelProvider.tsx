'use client'
import React, {ReactNode} from 'react'
import {OpenMenuContextAdminsPanel} from '@/context/OpenMenuContextAdminsPanel'
import {IUser} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'

export default function OpenMenuAdminsPanelProvider({children}: {children: ReactNode}) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [user, setUser] = React.useState<IUser>({id:'', avatar:'', role:'', login:'', bans:[], warns:[]})
  const [isOpenList, setIsOpenList] = React.useState(false);
  const value = {
    isOpen: isOpen,
    setIsOpen: setIsOpen,
    id:user.id,
    login: user.login,
    avatar: user.avatar,
    role: user.role,
    setUser:setUser,
    isOpenList:isOpenList,
    setIsOpenList:setIsOpenList,
    bans:user.bans,
    warns: user.warns,
  }
  return <OpenMenuContextAdminsPanel value={value}>{children}</OpenMenuContextAdminsPanel>
}