import {notFound} from 'next/navigation'
import SettingsContent from '@/components/shared/settings/SettingsContent'
import {settingsList} from '@/data/settingsList'
import {Metadata} from 'next'

export async function generateMetadata({params}:{params:Promise<{type:string}>}): Promise<Metadata> {
  const {type} = await params
  return {
    title: type === 'main'?'Multi Forum | Основные настройки': type === 'secure'?'Multi Forum | Настройки безопасности':type === 'devices'?'Multi Forum | Активные сеансы': type === 'historyPunishment'?'Multi Forum | История наказаний':'Multi Forum',
    description: 'Управляйте своими данными, изменяйте пароль, настраивайте уведомления, обновляйте профиль и просматривайте историю активности на форуме.'
  }
}
export default async function Page({params}:{params:Promise<{type:string}>}) {
  const {type} = await params
  if(!settingsList.some((set)=>type === set.url)){
    notFound()
  }
  return <SettingsContent/>
}