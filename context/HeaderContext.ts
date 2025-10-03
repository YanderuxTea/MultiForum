'use client';
import React, {createContext} from 'react'

export interface IHeaderContext {
  isOpenMenu: boolean;
  setIsOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
}
export const HeaderContext = createContext<IHeaderContext|null>(null)
