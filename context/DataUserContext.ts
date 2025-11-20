import {createContext} from 'react'
import {IPayload} from '@/lib/jwt'

export const DataUserContext = createContext<IPayload|null>(null)