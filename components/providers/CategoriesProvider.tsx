'use client'
import {CategoriesContext, ICategories} from '@/context/CategoriesContext'
import React, {useEffect} from 'react'
import useLoader from '@/hooks/useLoader'

export default function CategoriesProvider({children}: {children: React.ReactNode}) {
  const [categories, setCategories] = React.useState<ICategories[]>([])
  const {setLoading} = useLoader()
  useEffect(() => {
    setLoading(async ()=>{
      const req = await fetch('/api/categories/get',{
        method: 'GET',
      })
      const res = await req.json()
      setCategories(res.data)
    })
  }, [])
  const value = {
    categories: categories,
    setCategories: setCategories,
  }
  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>
}