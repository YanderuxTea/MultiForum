'use client'
import {adminsPanelData} from '@/data/adminsPanelData'
import AdminsPanelCard from '@/components/shared/adminspanels/AdminsPanelCard'

export default function AdminsPanelCardFull() {
  return adminsPanelData.map((panel, index) => {
      return <AdminsPanelCard props={panel} key={index}/>
    })
}