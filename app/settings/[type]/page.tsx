import {notFound} from 'next/navigation'
import SettingsContent from '@/components/shared/settings/SettingsContent'

export default async function Page({params}:{params:Promise<{type:string}>}) {
  const {type} = await params
  const settingsParams = ['main', 'secure', 'devices']
  if(!settingsParams.includes(type)){
    notFound()
  }
  return <SettingsContent/>
}