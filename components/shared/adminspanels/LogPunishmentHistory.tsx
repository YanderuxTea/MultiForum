import {IPunishmentList} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'

export default function LogPunishmentHistory({props, isBan, formattedDate, type}:{props:IPunishmentList, isBan:boolean, formattedDate:string, type:string}) {
  return <p className='text-neutral-800 dark:text-neutral-200 font-medium bg-white dark:bg-[#212121]'>
    <span className='text-sm text-neutral-600 dark:text-neutral-400'>{formattedDate} </span>
    <span className='break-words text-neutral-900 dark:text-neutral-100 font-bold'>{type==='punishment'?props.admin:props.Unbans?props.Unbans.admin:props.Unwarns?props.Unwarns.admin:null} </span>
    {type ==='punishment'? isBan?'заблокировал ':'предупредил ':isBan?'разбанил ':'снял предупреждение '}
    {type==='punishment'&&isBan&&<span className='text-red-600'>{props.time===0?'навсегда ':`на ${props.time} минут `}</span>}
    <span>по причине: </span>
    <span className='text-red-600 break-all'>{type==='punishment'?props.reason:props.Unbans?props.Unbans.reason:props.Unwarns?.reason} </span>
  </p>
}