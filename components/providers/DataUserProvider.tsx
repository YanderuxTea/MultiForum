'use client'
import {DataUserContext} from '@/context/DataUserContext'
import React, {useEffect, useState} from 'react'
import useLoader from '@/hooks/useLoader'
import {IPayload} from '@/lib/jwt'

export default function DataUserProvider({ children }: { children: React.ReactNode }) {
  const {setLoading} = useLoader()
  const [data, setData] = useState<IPayload|null>(null)
  useEffect(() => {
    async function fetchDataUser() {
      setLoading(async ()=>{
        const response = await fetch('/api/getDataUser')
        const data = await response.json()
        setData(data.user)
      })
    }
    fetchDataUser()
  }, [])
  return <DataUserContext.Provider value={data}>{children}</DataUserContext.Provider>
}