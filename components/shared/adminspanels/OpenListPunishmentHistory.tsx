import {AnimatePresence, motion} from 'framer-motion'
import HistoryPunishmentList from '@/components/shared/adminspanels/HistoryPunishmentList'
import React, {useEffect} from 'react'
import useOpenMenuAdminsPanel from '@/hooks/useOpenMenuAdminsPanel'

export default function OpenListPunishmentHistory() {
  const {login, isOpenList, bans, warns} = useOpenMenuAdminsPanel()
  useEffect(() => {
    setOpenBans(false)
    setOpenWarns(false)
  }, [login, isOpenList])
  const [openWarns, setOpenWarns] = React.useState<boolean>(false)
  const [openBans, setOpenBans] = React.useState<boolean>(false)
  return <motion.div key='historyList' initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className='overflow-clip flex flex-col gap-2.5'>
    <p className='font-bold text-neutral-900 dark:text-neutral-100 cursor-pointer select-none' onClick={()=>setOpenBans(prevState => !prevState)}>Баны:</p>
    <AnimatePresence>
      {openBans&&<motion.div key='bans' initial={{height:0, overflowY:'clip'}} animate={{height:200, overflowY:'auto'}} exit={{height:0, overflowY:'clip'}}
                             className={`flex py-2.5 flex-col gap-2.5 h-50 border bg-neutral-100 border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 rounded-md ${bans.length === 0 && 'justify-center items-center'}`}>
        {bans.length > 0 ? bans.map((ban) => {
          return <HistoryPunishmentList key={ban.id} props={ban}/>
        }) : <motion.p className='text-neutral-700 font-medium dark:text-neutral-300 w-full text-center'>Нет банов</motion.p>}
      </motion.div>}
    </AnimatePresence>
    <p className='font-bold text-neutral-900 dark:text-neutral-100 cursor-pointer select-none' onClick={()=>setOpenWarns(prevState => !prevState)}>Предупреждения:</p>
    <AnimatePresence>
      {openWarns&&<motion.div key='warns' initial={{height:0, overflowY:'clip'}} animate={{height:200, overflowY:'auto'}} exit={{height:0, overflowY:'clip'}}
                              className={`flex-col py-2.5 gap-2.5 h-50 flex border bg-neutral-100 border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 rounded-md ${warns.length === 0 && 'justify-center items-center'}`}>
        {warns.length > 0 ? warns.map((warn) => {
          return <HistoryPunishmentList key={warn.id} props={warn}/>
        }) : <motion.p className='text-neutral-700 font-medium dark:text-neutral-300 w-full text-center'>Нет предупреждений</motion.p>}
      </motion.div>}
    </AnimatePresence>
  </motion.div>
}