'use client'
import React, {useEffect} from 'react'
import {ContextTwoFactor} from '@/context/ContextTwoFactor'
import useLoader from '@/hooks/useLoader'
import {ITwoFactor} from '@/lib/jwt'

export default function TwoFactorProvider({children}:{children:React.ReactNode}) {
  const {setLoading} = useLoader()
  const [value, setValue] = React.useState<ITwoFactor>()
  useEffect(() => {
    setLoading(async()=>{
      const req = await fetch('/api/twoFactor/validateTwoFactor',{
        method: 'GET',
      })
      const res = await req.json()
      if(res.isEnabled){
        setValue(res.data)
      }
    })
  }, [])
  return <ContextTwoFactor.Provider value={value}>{children}</ContextTwoFactor.Provider>
}