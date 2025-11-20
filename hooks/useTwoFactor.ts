import {ContextTwoFactor} from '@/context/ContextTwoFactor'
import React from 'react'

export default function useTwoFactor() {
  return React.useContext(ContextTwoFactor)
}