import {ChoosePhotoContext} from '@/context/ChoosePhotoContext'
import React from 'react'

export default function useChoosePhoto() {
  const context = React.useContext(ChoosePhotoContext)
  if (!context) {throw Error('Error ChoosePhotoContext') }
  return context
}