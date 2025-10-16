'use client'
import Telegram from '@/components/shared/icons/Telegram'
import Link from 'next/link'
import useCurrentWidth from '@/hooks/useCurrentWidth'
import SwitcherTheme from '@/components/shared/SwitcherTheme'

export default function Footer() {
  const width = useCurrentWidth()
  return <footer className='bg-white dark:bg-[#212121] w-full flex items-center justify-center px-2.5 z-1 border-t border-neutral-300 dark:border-neutral-700'>
    <div className='max-w-300 w-full py-2.5 flex flex-row justify-between items-center'>
      <div className='flex flex-col gap-2.5'>
        <p className='text-neutral-700 dark:text-neutral-200 text-lg font-bold'>Контакты</p>
        <div className='flex flex-row  justify-between items-center'>
          <p className='font-medium text-sm text-neutral-500 dark:text-neutral-400'>Telegram</p>
          <Link href='https://t.me/teawithsug' className='group'>
            <Telegram/>
          </Link>
        </div>
      </div>
      {width>768&&<SwitcherTheme/>}
    </div>
  </footer>
}