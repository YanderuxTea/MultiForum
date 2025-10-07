import {useContext} from 'react'
import {NotifyContext} from '@/context/NotifyContext'

export default function useNotify() {
  const context = useContext(NotifyContext)
  if(!context) throw new Error('useNotify must be used within context')
  return context
}