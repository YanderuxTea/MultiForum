import {FormContext, IFormContext} from '@/context/FormContext'
import {useContext} from 'react'

export default function useFormContext():IFormContext {
  const context = useContext(FormContext)
  if(!context) {
    throw new Error('useFormContext must be used within the context')
  }
  return context
}