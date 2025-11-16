import {useContext} from 'react'
import {CategoriesContext} from '@/context/CategoriesContext'

export default function useCategories() {
  const context = useContext(CategoriesContext);
  if (!context) throw new Error('useCategories must be defined');
  return context
}