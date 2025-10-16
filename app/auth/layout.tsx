'use client'
import {ReactNode} from 'react'
import Link from 'next/link'
import FormProvider from '@/components/providers/FormProvider'
import {AnimatePresence, motion} from 'framer-motion'
import {useParams} from 'next/navigation'

export default function AuthLayout({children}: {children: ReactNode}) {
  const params = useParams()
  return <main className='min-h-screen flex items-center w-full justify-center px-2.5'>
      <motion.div layout className='border border-neutral-300 dark:border-neutral-700 flex flex-col items-center justify-center max-w-150 p-2.5 rounded-[18px] gap-5 w-full overflow-hidden bg-white dark:bg-[#212121]'>
        <motion.div layout className='flex flex-row gap-1.25 border border-neutral-300 dark:border-neutral-700 text-center p-1.25 rounded-lg w-full'>
          <AnimatePresence>
            <Link href='/auth/login' key={'loginLink'} className={`rounded-[3px] font-medium w-1/2 py-1.25 relative transition-colors duration-300 ease-out ${params.type === 'login'?'text-white':'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
              <p className='relative z-1'>Вход</p>
              {params.type === 'login'&&
                <motion.span className='absolute inset-0 bg-orange-600 dark:bg-orange-700 z-0 rounded-[3px]' layoutId='backgroundLink'></motion.span>}
            </Link>
            <Link href='/auth/register' key={'registerLink'} className={`rounded-[3px] font-medium w-1/2 py-1.25 relative transition-colors duration-300 ease-out ${params.type === 'register'?'text-white':'text-neutral-700 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
              <p className='relative z-1'>Регистрация</p>
              {params.type === 'register'&&
                <motion.span className='absolute inset-0 bg-orange-600 dark:bg-orange-700 z-0 rounded-[3px]' layoutId='backgroundLink'></motion.span>}
            </Link>
          </AnimatePresence>
        </motion.div>
        <FormProvider>
          {children}
        </FormProvider>
      </motion.div>
  </main>
}