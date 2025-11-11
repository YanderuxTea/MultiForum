import LogPunishmentHistory from '@/components/shared/adminspanels/LogPunishmentHistory'
import {IPunishmentList} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'

export default function HistoryPunishmentList({props}:{props:IPunishmentList}) {
  const isBan = typeof props.time === 'number'
  const formattedDate = Intl.DateTimeFormat('ru-RU', {timeStyle:'medium', dateStyle:'medium'}).format(new Date(props.date))
  const formattedDateUnbanUnwarns = Intl.DateTimeFormat('ru-RU', {timeStyle:'medium', dateStyle:'medium'}).format(new Date(props.Unwarns?props.Unwarns.date:props.Unbans?props.Unbans.date:Date.now()))
  return <div className='border-y border-neutral-300 dark:border-neutral-700 gap-2.5 p-2.5 flex flex-col bg-white dark:bg-[#212121]'>
    {props.Unbans?<LogPunishmentHistory props={props} isBan={isBan} formattedDate={formattedDateUnbanUnwarns} type='unpunishment'/>:props.Unwarns?<LogPunishmentHistory props={props} isBan={isBan} formattedDate={formattedDateUnbanUnwarns} type='unpunishment'/>:null}
    <LogPunishmentHistory props={props} type='punishment' isBan={isBan} formattedDate={formattedDate}/>
  </div>
}