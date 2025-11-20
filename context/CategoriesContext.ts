import React, {createContext} from 'react'

export interface IUser{
  login: string,
  avatar: string | null,
  role: string,
}
export interface IPosts{
  id: string
  createdAt: Date
  idUser: string
  title: string
  idSubCategories: string
  locked: boolean
  pinned: boolean
  user: IUser
}

export interface ISubCategories{
  id: string
  title: string
  position: number
  icon: string
  idCategories: string
  posts: IPosts[]
  _count:{
    posts:number
  }
}
export interface ICategories{
  id: string
  title: string
  position: number
  subCategories: ISubCategories[]
}
export interface ICategoriesContext {
  categories: ICategories[]
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>
}
export const CategoriesContext = createContext<ICategoriesContext|null>(null)