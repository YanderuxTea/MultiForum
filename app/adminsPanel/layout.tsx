import {ReactNode} from 'react'
import AdminsPanelCardFull from '@/components/shared/adminspanels/AdminsPanelCardFull'
import StubUnderHeader from '@/components/shared/stubs/StubUnderHeader'
import StubHeader from '@/components/shared/stubs/StubHeader'
import OpenMenuAdminsPanelProvider from '@/components/providers/OpenMenuAdminsPanelProvider'

export default function LayoutAdminPanel({children}: {children: ReactNode}) {
  return <main className='min-h-screen flex flex-col w-full py-5 px-2.5'>
    <StubHeader />
    <StubUnderHeader/>
    <div className='flex flex-col gap-2.5 mt-2.5 lg:flex-row w-full max-w-300 mx-auto'>
      <div className='flex flex-col gap-2.5 bg-white dark:bg-[#212121] p-5 border border-neutral-300 dark:border-neutral-700 rounded-md lg:max-h-max lg:min-w-100'>
        <p className='text-neutral-900 dark:text-neutral-100 font-bold'>Выберите раздел Администрирования:</p>
        <div className='flex flex-col gap-2.5'>
          <AdminsPanelCardFull/>
        </div>
      </div>
      <OpenMenuAdminsPanelProvider>
        {children}
      </OpenMenuAdminsPanelProvider>
    </div>
  </main>
}