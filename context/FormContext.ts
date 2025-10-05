'use client'
import React, {createContext} from 'react'

export interface IFormContext {
  isValid: string[],
  isInvalid: string[],
  handleValidate: (e: React.ChangeEvent<HTMLInputElement>, id:string, pattern?:RegExp, min?:number, max?:number) => void,
}
export const FormContext = createContext<IFormContext|null>(null)