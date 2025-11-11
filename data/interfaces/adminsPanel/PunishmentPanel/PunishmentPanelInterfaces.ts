import React from 'react'

export interface IUnbans{
  id: string
  idUser: string
  reason: string
  date: Date
  admin: string
  idBan: string
}
export interface IBans{
  id: string
  idUser: string
  reason: string
  date: Date
  admin: string
  time: number
}
export interface IWarns{
  id: string
  idUser: string
  reason: string
  date: Date
  admin: string
}
export interface IUnwarns{
  id: string
  idUser: string
  reason: string
  date: Date
  admin: string
  idWarn: string
}
export interface IUser{
  id: string
  login: string
  role: string
  avatar?: string
  bans: (IBans & { Unbans: IUnbans | null })[]
  warns: (IWarns & { Unwarns: IUnwarns | null })[]
}
export interface IPunishmentList{
  id: string
  idUser: string
  reason: string
  date: Date
  admin: string
  time?: number
  Unbans?:IUnbans|null
  Unwarns?:IUnwarns|null
}
export interface PropsUseUnbanUser{
  setPending: React.TransitionStartFunction,
  selectBans: {
    id: string
    idUser: string
    reason: string
    date: Date
    admin: string
    time: number
  }[],
  reason: string,
  setIsNotify: React.Dispatch<React.SetStateAction<boolean>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>,
  id: string,
}
export interface PropsUseUnwarnUser{
  setPending: React.TransitionStartFunction,
  selectWarns: {
    id: string
    idUser: string
    reason: string
    date: Date
    admin: string
  }[],
  reason: string,
  setIsNotify: React.Dispatch<React.SetStateAction<boolean>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>,
  id: string,
}