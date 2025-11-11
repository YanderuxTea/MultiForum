'use client'
import {PropsUseUnbanUser} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'

export default function useUnbanUser({props}:{props:PropsUseUnbanUser}) {
  async function unbanUser(){
    props.setPending(async ()=>{
      if(props.selectBans.length === 0){
        props.setIsNotify(true)
        props.setMessage('Ошибка: выберите хотя бы 1 активный бан')
      }else if(props.reason.trim().length === 0){
        props.setIsNotify(true)
        props.setMessage('Ошибка: напишите причину разблокировки')
      }else if(props.reason.trim().length >0 && props.selectBans.length > 0) {
        const req = await fetch('/api/unbanUser',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({selectBans:props.selectBans, reason:props.reason}),
        })
        const res: {ok:boolean, message:string, result:{id:string, idBan:string, idUser:string, reason:string, date:Date, admin:string}[]} = await req.json()
        if(res.ok){
          props.setMessage(res.message)
          props.setIsNotify(true)
          props.setIsOpen(false)
          props.setUsers(prevState => prevState.map(user=> {
            if(user.id !== props.id){
              return user
            }
            const updateBans = user.bans.map((ban)=>{
              const matchedBan = res.result.find(unban=>unban.idBan === ban.id)
              if(matchedBan){
                return {...ban, Unbans:matchedBan}
              }
              return ban
            })
            return {...user, bans:updateBans}
          }))
        }
      }
    })
  }
  return unbanUser
}