import React from 'react'

interface IProps {
  reason: string
  setReason: React.Dispatch<React.SetStateAction<string>>
  pending: boolean,
  placeholder:string,
  name: string,
  id:string
}
export default function InputPunishment({props}:{props:IProps}) {

  return <div className='relative'>
    <input type='text' placeholder={props.placeholder} disabled={props.pending} className='border p-1.25 rounded-md border-neutral-500 dark:border-neutral-500 outline-none w-full bg-white dark:bg-[#212121] relative z-1 peer' name={props.name} id={props.id} value={props.reason} onChange={(e)=>props.setReason(e.target.value)}/>
    <span className='absolute inset-0 z-0 rounded-md outline-1 blur-[5px] outline-neutral-900 dark:outline-neutral-100 transition-opacity duration-300 ease-out opacity-0 peer-focus:opacity-100'></span>
  </div>
}