'use client'
import Telegram from '@/components/shared/icons/Telegram'
import Link from 'next/link'
import useCurrentWidth from '@/hooks/useCurrentWidth'
import SwitcherTheme from '@/components/shared/SwitcherTheme'

export default function Footer() {
  const width = useCurrentWidth()
  return <footer className='bg-white dark:bg-[#212121] w-full flex items-center justify-center px-2.5'>
    <div className='max-w-300 w-full py-2.5 flex flex-row justify-between items-center'>
      <div className='flex flex-row gap-2.5 items-center'>
        <p className='font-medium text-sm text-black/75 dark:text-white/75'>Связаться с разработчиком</p>
        <Link href='https://t.me/teawithsug' className='group'>
          <Telegram/>
        </Link>
      </div>
      {width>768&&<SwitcherTheme/>}
    </div>
  </footer>
}