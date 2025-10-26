'use client'
import {useParams} from 'next/navigation'
import MainSettings from '@/components/ui/MainSettings'
import SecureSettings from '@/components/ui/SecureSettings'
import DevicesSettings from '@/components/ui/DevicesSettings'

export default function SettingsContent() {
  const params = useParams();
  const setting = params.type === 'main'?<MainSettings/>:params.type==='secure'?<SecureSettings/>:<DevicesSettings/>;
  return <div className='max-h-max w-full bg-white dark:bg-[#212121] border border-neutral-300 dark:border-neutral-700 rounded-md p-5'>
      {setting}
  </div>
}