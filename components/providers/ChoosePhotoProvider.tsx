'use client'
import React, {ReactNode, useEffect} from 'react'
import {ChoosePhotoContext} from '@/context/ChoosePhotoContext'

export default function ChoosePhotoProvider({children}: {children: ReactNode}) {
  const [isChoosePhoto, setIsChoosePhoto] = React.useState(false);
  const value ={
    isChoosePhoto:isChoosePhoto,
    setIsChoosePhoto:setIsChoosePhoto,
  }
  useEffect(() => {
    if(isChoosePhoto){
      document.body.style.overflow = 'hidden'
    }else {
      document.body.style.overflow = 'unset'
    }
  }, [isChoosePhoto])
  return <ChoosePhotoContext.Provider value={value}>{children}</ChoosePhotoContext.Provider>
}