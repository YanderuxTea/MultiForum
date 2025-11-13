import {notFound} from 'next/navigation'
import SettingsContent from '@/components/shared/settings/SettingsContent'
import {settingsList} from '@/data/settingsList'

export default async function Page({params}:{params:Promise<{type:string}>}) {
  const {type} = await params
  if(!settingsList.some((set)=>type === set.url)){
    notFound()
  }
  return <SettingsContent/>
}