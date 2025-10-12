import {useContext} from 'react'
import {DataUserContext} from '@/context/DataUserContext'

export default function useDataUser() {
  const context = useContext(DataUserContext)
  if(context === undefined) throw new Error('useDataUser must be used within the context')
  return context
}