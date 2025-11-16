'use client'
import StubHeader from '@/components/shared/stubs/StubHeader'
import StubUnderHeader from '@/components/shared/stubs/StubUnderHeader'
import useDataUser from '@/hooks/useDataUser'
import useCheckingStaff from '@/hooks/useCheckingStaff'
import ManagementCategoriesButton from '@/components/shared/buttons/ManagementCategoriesButton'
import useCategories from '@/hooks/useCategories'
import CategoriesMain from '@/components/shared/categories/CategoriesMain'


export default function Page() {
  const dataUser = useDataUser()
  const {isAdmin} = useCheckingStaff({role:dataUser?.role||'User'})
  const categories = useCategories()
  return <main className='min-h-screen flex flex-col gap-2.5 w-full px-2.5 items-center'>
    <div className='w-full max-w-300 flex flex-col py-2.5 gap-2.5'>
      <div>
        <StubHeader/>
        <StubUnderHeader/>
      </div>
      <div className='flex flex-col lg:flex-row gap-5 w-full'>
        <div className='flex flex-col gap-5 w-full lg:w-5/7'>
          <div className='flex flex-col lg:flex-row lg:justify-between gap-2.5'>
            <p className='text-lg lg:text-xl font-bold text-neutral-800 dark:text-neutral-200'>Категории и разделы</p>
            {isAdmin&&<ManagementCategoriesButton/>}
          </div>
          {categories.categories.length>0&&categories.categories.map((category) => {return <CategoriesMain key={category.id} props={category}/>})}
        </div>
        <div className='w-full lg:w-2/7 flex flex-col gap-5'>
          <div className='rounded-md bg-white dark:bg-[#212121] p-2.5'>
            Инфа
          </div>
          <div className='rounded-md bg-white dark:bg-[#212121] p-2.5'>
            Инфа
          </div>
        </div>
      </div>
    </div>
  </main>
}