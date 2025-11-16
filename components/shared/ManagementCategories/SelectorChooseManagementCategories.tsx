import {IManagementCategoriesButtonsData} from '@/data/managementCategoriesButtonsData'
import React from 'react'
import {motion} from 'framer-motion'

interface IProps extends IManagementCategoriesButtonsData{
  setValue: React.Dispatch<React.SetStateAction<string>>
  valueState: string
  pending:boolean
  setPending:React.TransitionStartFunction
}
export default function SelectorChooseManagementCategories({props}:{props:IProps}) {
  return <button disabled={props.pending} onClick={()=>props.setValue(props.value)} className={`disabled:bg-neutral-200 dark:disabled:bg-neutral-700 relative p-1.25 rounded-md cursor-pointer disabled:cursor-default transition-colors group duration-300 ease-out ${props.value !== props.valueState&&'hover:bg-neutral-200 hover:dark:bg-neutral-700 disabled:bg-neutral-300 dark:disabled:bg-neutral-600'}`}>
    {props.value===props.valueState&&<motion.span layoutId={'bgButtonSelectorCategories'} className='absolute inset-0 z-0 bg-orange-500 dark:bg-orange-600 rounded-md group-disabled:bg-neutral-400 dark:group-disabled:bg-neutral-700'></motion.span>}
    <p className={`relative z-1 transition-colors duration-300 ease-out font-medium ${props.value===props.valueState?'text-neutral-100':'text-neutral-600 dark:text-neutral-400'}`}>{props.title}</p>
  </button>
}