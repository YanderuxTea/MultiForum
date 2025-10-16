import React from 'react'

export interface ChoosePhotoContext {
  isChoosePhoto: boolean
  setIsChoosePhoto: React.Dispatch<React.SetStateAction<boolean>>
}
export const ChoosePhotoContext = React.createContext<ChoosePhotoContext|null>(null)