import {useContext} from 'react'
import {LoaderContext} from '@/context/LoaderContext'

export default function useLoader() {
  const context = useContext(LoaderContext)
  if(!context) throw new Error('useLoader must be used within useLoader')
  return context
}