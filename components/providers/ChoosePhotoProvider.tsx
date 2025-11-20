'use client'
import React, {ReactNode} from 'react'
import {ChoosePhotoContext} from '@/context/ChoosePhotoContext'

export default function ChoosePhotoProvider({children}: {children: ReactNode}) {
  const [isChoosePhoto, setIsChoosePhoto] = React.useState(false);
  const [isHelp, setIsHelp] = React.useState(false);
  const value ={
    isChoosePhoto:isChoosePhoto,
    setIsChoosePhoto:setIsChoosePhoto,
    isHelp:isHelp,
    setIsHelp:setIsHelp
  }
  return <ChoosePhotoContext.Provider value={value}>{children}</ChoosePhotoContext.Provider>
}