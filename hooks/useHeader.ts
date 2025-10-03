
import {HeaderContext, IHeaderContext} from '@/context/HeaderContext'
import {useContext} from 'react'

export default function useHeader():IHeaderContext {
  const context = useContext(HeaderContext)
  if(context === null) {
    throw new Error('useHeader must be defined')
  }
  return context
}