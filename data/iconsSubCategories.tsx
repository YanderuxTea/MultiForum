import {JSX} from 'react'
import MessageIcon from '@/components/shared/icons/subCategoriesIcon/MessageIcon'
import DocumentIcon from '@/components/shared/icons/subCategoriesIcon/DocumentIcon'
import FlagIcon from '@/components/shared/icons/subCategoriesIcon/FlagIcon'
import CupIcon from '@/components/shared/icons/subCategoriesIcon/CupIcon'

export interface IIconsSubCategories {
  value: string
  icon: JSX.Element
}
export const iconsSubCategories: IIconsSubCategories[] = [
  {
    value:'message',
    icon: <MessageIcon/>
  },
  {
    value:'document',
    icon: <DocumentIcon/>
  },
  {
    value:'flag',
    icon: <FlagIcon/>
  },
  {
    value:'cup',
    icon:<CupIcon/>
  }
]