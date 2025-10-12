'use client'
import {ReactNode, useTransition} from 'react'
import {LoaderContext} from '@/context/LoaderContext'

export default function LoaderProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useTransition()
  const value = {loading, setLoading}
  return <LoaderContext.Provider value={value}>{children}</LoaderContext.Provider>
}