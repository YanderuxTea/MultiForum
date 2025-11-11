import React from 'react'
import IconCheck from '@/components/shared/icons/IconCheck'

interface IPropsWarn {
  id: string
  idUser: string
  reason: string
  date: Date
  admin: string,
}
interface IPropsBan extends IPropsWarn {
  time:number
}
interface ISetSelectWarns{
  id: string,
  idUser: string,
  reason: string,
  date: Date,
  admin: string,
}
interface ISetSelectBans extends ISetSelectWarns{
  time:number
}
export default function ActiveBansWarns({propsBan, propsWarn, setSelectWarns, setSelectBans, selectWarns, selectBans, pending}:{propsBan?:IPropsBan, propsWarn?:IPropsWarn, setSelectWarns?:React.Dispatch<React.SetStateAction<ISetSelectWarns[]>>, setSelectBans?:React.Dispatch<React.SetStateAction<ISetSelectBans[]>>, selectWarns?:IPropsWarn[], selectBans?:IPropsBan[], pending:boolean}) {
  function addRemoveBanWarn(){
    if(propsBan && setSelectBans && selectBans){
      const isSelected = selectBans.some((ban)=>ban.id === propsBan.id)
      if(isSelected){
        setSelectBans(prevState => prevState.filter((b)=>b.id !== propsBan.id))
      }else{
        setSelectBans(prevState => [...prevState, propsBan])
      }
    }
    if(propsWarn && setSelectWarns&& selectWarns){
      const isSelected = selectWarns.some((warn)=>warn.id === propsWarn.id)
      if(isSelected){
        setSelectWarns(prevState => prevState.filter((warn)=>warn.id !== propsWarn.id))
      }else {
        setSelectWarns(prevState => [...prevState, propsWarn])
      }
    }
  }
  const isSelectedWarn = selectWarns?.some((warn)=>warn.id === propsWarn?.id)
  const isSelectedBan = selectBans?.some((ban)=>ban.id === propsBan?.id)
  const formattedDate = Intl.DateTimeFormat('ru-RU', {timeStyle:'medium', dateStyle:'medium'}).format(new Date(propsWarn?propsWarn.date:propsBan?propsBan.date:Date.now()))
  return <div className='flex flex-row justify-between items-center border-y border-neutral-300 dark:border-neutral-700 p-2.5 bg-white dark:bg-[#212121]'>
    <p className='text-neutral-800 dark:text-neutral-200 font-medium w-7/8'>
      <span className='text-sm text-neutral-600 dark:text-neutral-400'>{formattedDate} </span>
      <span className='break-words text-neutral-900 dark:text-neutral-100 font-bold'>{propsBan?propsBan.admin:propsWarn?propsWarn.admin:null} </span>
      {propsBan?'заблокировал ':'предупредил '}
      {propsBan&&<span className='text-red-600'>{propsBan.time===0?'навсегда ':`на ${propsBan.time} минут `}</span>}
      <span>по причине: </span>
      <span className='text-red-600 break-all'>{propsBan?propsBan.reason:propsWarn?propsWarn.reason:null}</span>
    </p>
    <button type='button' disabled={pending} className={`disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:border-neutral-300 dark:disabled:border-neutral-700 disabled:cursor-default cursor-pointer rounded-md transition-colors duration-300 ease-out w-7 flex items-center justify-center aspect-square border  ${propsBan?isSelectedBan?'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600':'border-neutral-300 dark:border-neutral-700':propsWarn?isSelectedWarn?'bg-green-500 dark:bg-green-600 border-green-500 dark:border-green-600':'border-neutral-300 dark:border-neutral-700':''}`} onClick={pending?undefined:()=>addRemoveBanWarn()}>{propsBan?isSelectedBan?<IconCheck/>:null:isSelectedWarn?<IconCheck/>:null}</button>
  </div>
}