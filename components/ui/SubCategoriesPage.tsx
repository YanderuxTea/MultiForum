'use client'
import {useParams, useSearchParams} from 'next/navigation'
import useDataUser from '@/hooks/useDataUser'
import Link from 'next/link'
import useLoader from '@/hooks/useLoader'
import React, {useEffect, useMemo, useState} from 'react'
import {IPosts} from '@/context/CategoriesContext'
import Pagination from '@/components/shared/Pagination'
import useNotify from '@/hooks/useNotify'
import CardTheme from '@/components/shared/themes/CardTheme'
import useCheckingStaff from '@/hooks/useCheckingStaff.tsx'

export default function SubCategoriesPage() {
  const searchParams = useSearchParams()
  const params = useParams()
  const idSubCat = searchParams.get('subCategory')
  const userData = useDataUser()
  const [themes, setThemes] = useState<IPosts>()
  const [pageNumber, setPageNumber] = useState<number|null>(null)
  const {setLoading} = useLoader()
  const {setMessage, setIsNotify} = useNotify()
  const {isAdmin} = useCheckingStaff({role:userData?userData.role:'User'})
  const totalPages = useMemo(()=>{
    return themes?Math.ceil(themes._count.posts/20):0
  },[themes])
  useEffect(()=>{
    if(!idSubCat){
      return
    }
    const themeIdLocal = localStorage.getItem('subId')
    const pageNumberLocal = localStorage.getItem('pageNumberSub')
    if(themeIdLocal !== idSubCat){
      setPageNumber(0)
      localStorage.setItem('subId', idSubCat)
    }else if(!isNaN(Number(pageNumberLocal))){
      setPageNumber(Number(pageNumberLocal))
    }
  },[idSubCat])
  useEffect(() => {
    if(!idSubCat){
      return
    }
    localStorage.setItem('pageNumberSub', String(pageNumber))
    if(pageNumber !== Number(localStorage.getItem('pageNumberSub'))){
      return
    }else{
      setLoading(async ()=>{
        const req = await fetch('/api/categories/getThemes',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id: idSubCat, page: pageNumber}),
        })
        const res = await req.json()
        if(res.ok){
          setThemes(res.data)
        }else {
          setMessage(`Ошибка: ${res.error}`)
          setIsNotify(true)
        }
      })
      window.scrollTo({
        top: 0
      })
    }
  }, [pageNumber, idSubCat])
  if (!themes){
    return null
  }
  if (!idSubCat||typeof params.title !== 'string' || decodeURIComponent(params.title) !== themes?.title) {
    return <div className='grow flex items-center justify-center'>
      <p className='font-medium text-neutral-900 dark:text-neutral-100 text-lg'>Ошибка: 404 :(</p>
    </div>
  }
  const title = decodeURIComponent(params.title)
  return themes&&
    <div className='divide-y divide-neutral-300 dark:divide-neutral-700 flex flex-col flex-1'>
      <div className='flex flex-row justify-between items-center p-2.5'>
        <p className='text-lg font-bold text-neutral-900 dark:text-neutral-100 md:text-2xl'>{title}</p>
        {userData&&userData.verifyAdm === 'Yes'&&themes.change&&<Link href={`/createPost?subCategory=${idSubCat}`} className='font-medium text-white bg-orange-500 dark:bg-orange-600 px-2.5 py-1.25 rounded-sm transition-colors duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 cursor-pointer'>Создать</Link>}
        {!themes.change&&isAdmin&&<Link href={`/createPost?subCategory=${idSubCat}`} className='font-medium text-white bg-orange-500 dark:bg-orange-600 px-2.5 py-1.25 rounded-sm transition-colors duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 cursor-pointer'>Создать</Link>}
      </div>
      {totalPages>1&&
        <div className='p-2.5'>
          {typeof pageNumber === 'number'&&
            <Pagination id='upSub' pageNumber={pageNumber} setPageNumber={setPageNumber as React.Dispatch<React.SetStateAction<number>>} totalPages={totalPages} count={themes?themes._count.posts:0}/>
          }
        </div>
      }
      <div className='grow flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700'>
        {themes.posts.length>0? themes.posts.map((theme)=>{
            return <CardTheme setThemesAction={setThemes} key={theme.MessagesPosts[0].id} props={theme} subId={themes.id}/>
          }):
          <p className='text-center py-2.5 font-medium'>В данном разделе нет тем</p>
        }
      </div>
      {totalPages>1&&
        <div className='p-2.5'>
          {typeof pageNumber === 'number'&&
            <Pagination id='downSub' pageNumber={pageNumber} setPageNumber={setPageNumber as React.Dispatch<React.SetStateAction<number>>} totalPages={totalPages} count={themes?themes._count.posts:0}/>
          }
        </div>
      }
    </div>
}