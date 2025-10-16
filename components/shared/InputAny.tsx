import React from 'react'

interface IProps {
  value?: string;
  onChange?: React.Dispatch<React.SetStateAction<string>>;
  placeholder?: string;
  type?:string;
  id?:string;
  autoComplete?:string;
  readonly?:boolean;
}
export default function InputAny({value, onChange, placeholder, type, id, autoComplete, readonly}: IProps) {

  return <input readOnly={readonly?readonly:undefined} autoComplete={autoComplete?autoComplete:undefined} id={id} value={value!==null?value:undefined} onChange={onChange?(e)=>onChange(e.target.value.trim()):undefined} type={`${type?type:undefined}`} placeholder={`${placeholder?placeholder:''}`} className='border px-2.5 py-1 w-full rounded-md outline-none border-neutral-300 focus:border-neutral-400 transition-colors duration-300 ease-in-out dark:border-neutral-700 dark:focus:border-neutral-600'/>
}
