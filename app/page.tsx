'use client'
import StubHeader from '@/components/shared/stubs/StubHeader'
import StubUnderHeader from '@/components/shared/stubs/StubUnderHeader'
import useDataUser from '@/hooks/useDataUser'
import useCheckingStaff from '@/hooks/useCheckingStaff'
import ManagementCategoriesButton from '@/components/shared/buttons/ManagementCategoriesButton'
import useCategories from '@/hooks/useCategories'
import CategoriesMain from '@/components/shared/categories/CategoriesMain'
import {additionalInformation} from '@/data/additionallyInformation'
import AdditionallyInformation from '@/components/shared/categories/AdditionallyInformation'
import React from 'react'


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
          {additionalInformation.map((add, index)=>{
            return <AdditionallyInformation key={index} props={add}/>
          })}
        </div>
      </div>
    </div>
  </main>
}