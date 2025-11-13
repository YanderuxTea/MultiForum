import React, {useEffect} from 'react'
import {IPunishmentList} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'
import HistoryPunishmentList from '@/components/shared/adminspanels/HistoryPunishmentList'

export default function HistoryPunishmentSettings() {
  const [pending, setPending] = React.useTransition()
  const [historyList, setHistoryList] = React.useState<IPunishmentList[]>([])
  useEffect(()=>{
    setPending(async ()=>{
      const req = await fetch('/api/getHistoryPunishment',{
        method: 'GET',
      })
      const res = await req.json()
      if(res.ok){
        setHistoryList(res.user)
      }
    })
  },[])
  return <div className='flex flex-col gap-2.5 min-h-screen max-h-screen'>
    <p className='text-2xl text-neutral-800 dark:text-neutral-200 font-bold'>История наказаний</p>
    <div className={`flex flex-col gap-2.5 w-full grow max-h-screen overflow-y-auto py-2.5 transition-colors duration-300 ease-out rounded-md border border-neutral-300 dark:border-neutral-700 ${pending?'animate-pulse bg-neutral-200 dark:bg-neutral-800':'animate-none bg-neutral-100 dark:bg-neutral-800'} ${historyList.length === 0&&'items-center justify-center'}`}>
      {pending?null:historyList.length === 0?
      <p className='w-full text-center text-neutral-800 dark:text-neutral-200 font-medium'>Нет наказаний. <br/>Святой вы человек...</p>
      : historyList.map((history:IPunishmentList) => {return <HistoryPunishmentList key={history.id} props={{id:history.id, idUser:history.idUser, reason:history.reason, date:history.date, admin:history.admin, time:history.time, Unwarns:history.Unwarns, Unbans:history.Unbans}}/>})
      }
    </div>
  </div>
}