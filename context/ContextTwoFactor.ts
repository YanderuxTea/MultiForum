'use client'
import React from 'react'
import {ITwoFactor} from '@/lib/jwt'

export const ContextTwoFactor = React.createContext<ITwoFactor|undefined>(undefined)