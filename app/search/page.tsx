import SearchForm from '@/components/ui/searches/SearchForm'
import StubHeader from '@/components/shared/stubs/StubHeader'
import StubUnderHeader from '@/components/shared/stubs/StubUnderHeader'
import React from 'react'
import FoundUsers from '@/components/ui/searches/FoundUsers'
import FoundThemes from '@/components/ui/searches/FoundThemes'
import TimeoutSearch from '@/components/shared/searches/TimeoutSearch'
import {Metadata} from 'next'

interface ISearchParams {
  query?: string,
  searchParams?: string,
}
export const metadata:Metadata = {
  title: 'Multi Forum | Поиск',
  description: 'Быстрый поиск по всем обсуждениям форума. Ищите конкретные темы, а также профили участников и опытных разработчиков по всем категориям.'
}
export default async function Page({searchParams}: {searchParams:Promise<ISearchParams>}) {
  const query = (await searchParams).query
  const searchFilter = (await searchParams).searchParams
  const baseUrl = (process.env.NODE_ENV !== 'production'?'http://localhost:3000/':process.env.NEXT_PUBLIC_SITE_URL)
  async function search(){
    const req = await fetch(`${baseUrl}api/searchUsersThemes`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({query: query, searchParams: searchFilter})
      })
    const res = await req.json()
    if(res.ok){
      return res.data
    }else if(res.status === 429) {
      return res.error
    }else if (!res.ok) {
      return []
    }
  }
  const users = searchFilter&&query&&await search()
  return<main className='min-h-screen mt-5 w-full gap-2.5 flex flex-col px-2.5 py-5'>
    <div>
      <StubHeader/>
      <StubUnderHeader/>
      <div className='w-full bg-white dark:bg-[#212121] flex justify-center p-2.5 max-w-200 mx-auto rounded-md border border-neutral-300 dark:border-neutral-700'>
        <SearchForm query={query} searchFilter={searchFilter}/>
      </div>
    </div>
    {typeof users === 'number'&&
      <div className='max-w-200 bg-white dark:bg-[#212121] mx-auto w-full rounded-md border border-neutral-300 dark:border-neutral-700 text-center py-5'>
        <TimeoutSearch timeout={Number(users)}/>
      </div>
    }
    {typeof users !=='number'&&query&&<div
      className='flex bg-neutral-100 dark:bg-neutral-900 rounded-md border border-neutral-300 dark:border-neutral-700 flex-col gap-5 justify-center max-w-200 mx-auto px-2.5 py-5 w-full'>
      {(searchFilter === 'All' || searchFilter === 'User') &&
        <div className='flex flex-col gap-5'>
          <p className='text-lg font-bold text-neutral-800 dark:text-neutral-200'>Пользователи</p>
          <FoundUsers users={users}/>
        </div>}
      {(searchFilter === 'All' || searchFilter === 'Themes') &&
        <div className='flex flex-col gap-5'>
          <p className='text-lg font-bold text-neutral-800 lg:indent-2.5 dark:text-neutral-200'>Темы</p>
          <FoundThemes/>
        </div>}
    </div>}
    </main>
}