import {createContext} from 'react'

export interface DataUserContext {
  id: string;
  login: string;
  role: string;
  email: string;
  verifyEmail: string;
  verifyAdm: string;
}
export const DataUserContext = createContext<DataUserContext|null>(null)