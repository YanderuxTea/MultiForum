'use client'
import {adminsPanelData} from '@/data/adminsPanelData'
import AdminsPanelCard from '@/components/shared/adminspanels/AdminsPanelCard'
import useCheckingStaff from '@/hooks/useCheckingStaff'
import useDataUser from '@/hooks/useDataUser'

export default function AdminsPanelCardFull() {
  const dataUser = useDataUser()
  const {isModerator, ModeratorsRoutes} = useCheckingStaff({role:dataUser?dataUser.role:'User'})
  return adminsPanelData.map((panel, index) => {
      if(isModerator) {
        if(ModeratorsRoutes.includes(panel.url)){
          return <AdminsPanelCard props={panel} key={index}/>
        }
      }else {
        return <AdminsPanelCard props={panel} key={index}/>
      }
    })
}