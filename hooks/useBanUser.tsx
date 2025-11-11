import React from 'react'
import {IBans, IUnbans, IUser} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'

export default function useBanUser({time, reason, setPending, setMessage, setIsNotify, setUsers, id, setIsOpen}:{time:string,reason:string, setPending:React.TransitionStartFunction, setMessage:React.Dispatch<React.SetStateAction<string>>, setIsNotify:React.Dispatch<React.SetStateAction<boolean>>, setIsOpen:React.Dispatch<React.SetStateAction<boolean>>, setUsers:React.Dispatch<React.SetStateAction<IUser[]>>, id:string}) {
  async function banUser(){
    setPending(async ()=>{
      const timeNumber = Number(time.replace(/\s/g, ''))
      if(timeNumber === 0 || isNaN(timeNumber)){
        setIsNotify(true)
        setMessage('Ошибка: введите время блокировки в минутах')
        return
      }
      if(reason.trim().length === 0){
        setIsNotify(true)
        setMessage('Ошибка: напишите причину бана')
        return
      }
      if(reason.trim().length > 0 && timeNumber>0){
        const req = await fetch('/api/banUser', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id:id, reason:reason, time:timeNumber})
        })
        const res:{ok:boolean, message:string, result:(IBans&{Unbans:IUnbans|null})} = await req.json()
        if(res.ok){
          setIsNotify(true)
          setMessage(res.message)
          setIsOpen(false)
          setUsers(prevState => prevState.map(user=>{
            if(user.id !== res.result.idUser){
              return user
            }
            const updateBans = [...user.bans, res.result]
            updateBans.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime())
            return {...user, bans: updateBans}
          }))
        }
      }
    })
  }
  return banUser
}