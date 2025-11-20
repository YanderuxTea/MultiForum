'use client'
import {PropsUseUnwarnUser} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'

export default function useUnwarnUser({props}:{props:PropsUseUnwarnUser}) {
  async function unwarnUser(){
    props.setPending(async ()=>{
      if(props.selectWarns.length === 0){
        props.setIsNotify(true)
        props.setMessage('Ошибка: выберите хотя бы 1 активный варн')
      }else if(props.reason.trim().length === 0){
        props.setIsNotify(true)
        props.setMessage('Ошибка: напишите причину снятия варна')
      }else if(props.reason.trim().length >0 && props.selectWarns.length > 0) {
        const req = await fetch('/api/unwarnUser', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({selectWarns:props.selectWarns, reason:props.reason}),
        })
        const res: {ok:boolean, message:string, result:{id:string, idWarn:string, idUser:string, reason:string, date:Date, admin:string}[]} = await req.json()
        if(res.ok){
          props.setMessage(res.message)
          props.setIsNotify(true)
          props.setIsOpen(false)
          window.document.body.style.overflow = 'unset'
          props.setUsers(prevState => prevState.map(user=> {
            if(user.id !== props.id){
              return user
            }
            const updateWarns = user.warns.map((warn)=>{
              const matchedWarn = res.result.find(unwarn=>unwarn.idWarn === warn.id)
              if(matchedWarn){
                return {...warn, Unwarns:matchedWarn}
              }
              return warn
            })
            return {...user, warns:updateWarns}
          }))
        }
      }
    })
  }
  return unwarnUser
}