import React, {createContext} from 'react'

export interface ICategory {
  id: string
  title: string
  position: number
}
export interface ISubCategories{
  id: string
  title: string
  idCategories: string
}
export interface ICategories extends ICategory{
  subCategories: ISubCategories[]
}
export interface ICategoriesContext {
  categories: ICategories[]
  setCategories: React.Dispatch<React.SetStateAction<ICategories[]>>
}
export const CategoriesContext = createContext<ICategoriesContext|null>(null)