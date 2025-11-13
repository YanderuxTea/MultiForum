import useOpenMenuAdminsPanel from '@/hooks/useOpenMenuAdminsPanel'
import React, {useEffect, useMemo} from 'react'
import {AnimatePresence} from 'framer-motion'
import {IBans, IUser, IWarns} from '@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces'
import UnpunishmentPanel from '@/components/shared/adminspanels/UnpunishmentPanel'
import OpenListPunishmentHistory from '@/components/shared/adminspanels/OpenListPunishmentHistory'
import PunishmentPanel from '@/components/shared/adminspanels/PunishmentPanel'
import SelectorPunishmentUnpunishment from '@/components/shared/adminspanels/SelectorPunishmentUnpunishment'
import UserInfo from '@/components/shared/adminspanels/UserInfo'
import useCheckingStaff from '@/hooks/useCheckingStaff'
import useDataUser from '@/hooks/useDataUser'

export default function ContentMenuPunishmentManagement({banned, setPending, setUsers, users, pending} : {banned: boolean, setPending: React.TransitionStartFunction, setUsers:React.Dispatch<React.SetStateAction<IUser[]>>, users:IUser[], pending:boolean}) {
  const { bans, warns, setIsOpenList, isOpenList} = useOpenMenuAdminsPanel()
  const userData = useDataUser()
  const {isAdmin} = useCheckingStaff({role:userData?.role||'User'})
  const [checked, setChecked] = React.useState<string>('')
  const [selectWarns, setSelectWarns] = React.useState<IWarns[]>([])
  const [selectBans, setSelectBans] = React.useState<IBans[]>([])
  const [reason, setReason] = React.useState<string>('')
  const activeWarnsNumber = warns.filter((warn) => {
    if(warn.Unwarns){
      return false
    }
    return warn
  }).length % 3
  const activeBans = useMemo(()=>{
    return bans.filter((ban)=>{
      if(ban.Unbans){
        return false
      }
      return new Date(ban.date).getTime() + ban.time * 60 * 1000 > Date.now() || ban.time === 0
    })
  },[users])
  const activeWarns = useMemo(()=>{
    return warns.filter((warn)=>{
      if(warn.Unwarns) {
        return false
      }
      return warn
    })
  },[users])
  useEffect(() => {
    setSelectBans([])
    setSelectWarns([])
  }, [checked])
  return <div className='flex flex-col items-center gap-5'>
    <UserInfo banned={banned}/>
    <p className='text-neutral-700 dark:text-neutral-300'>Активные предупреждения: {activeWarnsNumber}/3</p>
    <div className='flex flex-col w-full'>
      <p onClick={()=>{setIsOpenList(prevState => !prevState)}} className={`mb-2.5 select-none text-center font-medium cursor-pointer transition-colors duration-300 ease-out ${isOpenList?'text-neutral-800 dark:text-neutral-200':'text-neutral-700 dark:text-neutral-300'}`}>История наказаний</p>
      <AnimatePresence>
      {isOpenList&&
        <OpenListPunishmentHistory/>
      }
      </AnimatePresence>
    </div>
    <SelectorPunishmentUnpunishment checked={checked} setChecked={setChecked} />
    <div className='flex flex-col w-full p-1.25'>
      {checked === 'punishment'?
        <PunishmentPanel pending={pending} setPending={setPending} setUsers={setUsers}/>
      : isAdmin&&checked==='unpunishment'
          ?
          <UnpunishmentPanel setUsers={setUsers} pending={pending} setPending={setPending} selectBans={selectBans} selectWarns={selectWarns} setSelectBans={setSelectBans} setSelectWarns={setSelectWarns} activeBans={activeBans} reason={reason} activeWarns={activeWarns} setReason={setReason}/>
          :null
      }
    </div>
  </div>
}