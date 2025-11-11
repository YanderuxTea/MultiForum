'use client'
import React, {createContext} from 'react'
import {IUser} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'

export interface IOpenMenuContextAdminsPanel extends IUser{
  isOpen: boolean,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setUser: React.Dispatch<React.SetStateAction<IUser>>,
  isOpenList: boolean,
  setIsOpenList: React.Dispatch<React.SetStateAction<boolean>>,
}
export const OpenMenuContextAdminsPanel = createContext<IOpenMenuContextAdminsPanel|null>(null);