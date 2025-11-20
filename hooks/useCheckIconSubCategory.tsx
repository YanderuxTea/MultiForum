import {ISubCategories} from '@/context/CategoriesContext'
import MessageIcon from '@/components/shared/icons/subCategoriesIcon/MessageIcon'
import DocumentIcon from '@/components/shared/icons/subCategoriesIcon/DocumentIcon'
import FlagIcon from '@/components/shared/icons/subCategoriesIcon/FlagIcon'
import CupIcon from '@/components/shared/icons/subCategoriesIcon/CupIcon'

export default function useCheckIconSubCategory({props}:{props:ISubCategories}) {
  return props.icon === 'message' ? <MessageIcon/> : props.icon === 'document' ?
    <DocumentIcon/> : props.icon === 'flag' ? <FlagIcon/> : props.icon === 'cup' ? <CupIcon/> : null
}