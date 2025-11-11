import {useContext} from 'react'
import {OpenMenuContextAdminsPanel} from '@/context/OpenMenuContextAdminsPanel'

export default function useOpenMenuAdminsPanel() {
  const context = useContext(OpenMenuContextAdminsPanel)
  if(!context) throw new Error('useOpenMenuAdminsPanel must be used within.')
  return context
}