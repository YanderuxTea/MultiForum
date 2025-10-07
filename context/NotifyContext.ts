'use client'
import React, {createContext} from 'react'

export interface INotifyContext {
  isNotify: boolean;
  setIsNotify: React.Dispatch<React.SetStateAction<boolean>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
}
export const NotifyContext = createContext<INotifyContext|null>(null)