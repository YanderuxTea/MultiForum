'use client'
import React, {useCallback, useEffect, useState} from 'react'
import {FormContext} from '@/context/FormContext'
import {useParams} from 'next/navigation'

export default function FormProvider({children}: {children: React.ReactNode}) {
  const [isValid, setIsValid] = useState<string[]>([])
  const [isInvalid, setIsInvalid] = useState<string[]>([])
  const params = useParams();
  const handleValidate = useCallback((e: React.ChangeEvent<HTMLInputElement>, id: string, pattern?:RegExp, min?: number, max?: number)=> {
    const text = e.target.value.trim()
    const length = text.length
    const login = !!(pattern&&max&&min);
    const pass = !!(!pattern && min && max);
    const email= !!(pattern && !min && !max);
    const delValid = ()=>{setIsValid(prevState => prevState.includes(id)?prevState.filter(v => v !== id):prevState)}
    const addValid = ()=>{setIsValid(prevState => prevState.includes(id)?prevState:[...prevState,id])}
    const delInvalid = ()=>{setIsInvalid(prevState => prevState.includes(id)?prevState.filter(v => v !== id):prevState)}
    const addInvalid = () =>{setIsInvalid(prevState => prevState.includes(id)?prevState:[...prevState,id])}
    if(params.type === 'login') {
      if(length===0){
        delValid()
      }else {
        addValid()
      }
    }else if(params.type === 'register') {
      if(length===0){
        delValid()
        delInvalid()
      }else {
        if(login){
          if(length>=min && length<=max && pattern.test(text)){
            delInvalid()
            addValid()
          }else {
            delValid()
            addInvalid()
          }
        }else if(pass){
          if(length>=min && length<=max){
            delInvalid()
            addValid()
          }else {
            delValid()
            addInvalid()
          }
        }else if(email){
          if(pattern.test(text)){
            delInvalid()
            addValid()
          }else {
            delValid()
            addInvalid()
          }
        }
      }
    }
  },[params.type])
  useEffect(() => {
    setIsValid([])
    setIsInvalid([])
  },[params.type])
  const value = {
    isValid: isValid,
    isInvalid: isInvalid,
    handleValidate: handleValidate
  }
  return <FormContext.Provider value={value}>{children}</FormContext.Provider>
}