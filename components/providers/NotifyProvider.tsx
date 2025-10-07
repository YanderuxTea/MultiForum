'use client'
import React, {ReactNode, useEffect} from 'react'
import {NotifyContext} from '@/context/NotifyContext'

export default function NotifyProvider({children}: {children: ReactNode}) {
  const [isNotify, setIsNotify] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const value = {
    isNotify: isNotify,
    setIsNotify: setIsNotify,
    message: message,
    setMessage: setMessage
  }
  useEffect(() => {
    if(isNotify){
      const timer = setTimeout(()=>{
        setIsNotify(false)
      },4000)
      return()=>clearTimeout(timer)
    }
  }, [isNotify])
  return <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>
}