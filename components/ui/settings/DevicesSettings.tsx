'use client'
import React, {useEffect, useRef, useState, useTransition} from 'react'
import {useRouter} from 'next/navigation'
import StubDevices from '@/components/shared/stubs/StubDevices'
import DeviceCard from '@/components/shared/devices/DeviceCard'
import {AnimatePresence} from 'framer-motion'

export interface DeviceList{
  deviceId: string;
  deviceType: string;
  id: string;
}
export default function DevicesSettings() {
  const [devices, setDevices] = useState<DeviceList[]>([])
  const router = useRouter()
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const currentDeviceId = useRef<string>('')
  const currentDeviceCardRef = useRef<HTMLDivElement>(null)
  const [baseWidth, setBaseWidth] = useState<number>(0)
  const [pendingAll, setPendingAll] = useTransition()
  const [pendingOne, setPendingOne] = useTransition()
  async function deleteAllDevices() {
    setPendingAll(async ()=>{
      const req = await fetch('/api/deleteAllDevices',{
        method: 'GET',
      })
      const res = await req.json()
      if(res.ok){
        setDevices(prevState => prevState.filter(device => device.deviceId === res.dId))
      }
    })
  }
  useEffect(() => {
    async function getDevices(){
      setIsLoading(true)
      const req = await fetch('/api/getDeviceList',{method: 'GET'})
      const data = await req.json()
      if(data.ok){
        currentDeviceId.current = data.dId
        const currDevice = data.devices.devices.find((device:DeviceList) => device.deviceId === currentDeviceId.current)
        const otherDevice = data.devices.devices.filter((device:DeviceList)=>device.deviceId !== currentDeviceId.current)
        setDevices([currDevice, ...otherDevice])
        setIsLoading(false)
      }else {
        router.push('/invalid')
      }
    }
    getDevices()
  }, [])
  useEffect(() => {
    function resizeWindow(){
      setBaseWidth(currentDeviceCardRef.current?currentDeviceCardRef.current.clientWidth+2:0)
    }
    setBaseWidth(currentDeviceCardRef.current?currentDeviceCardRef.current.clientWidth+2:0)
    window.addEventListener('resize', resizeWindow)
    return () => {window.removeEventListener('resize', resizeWindow)}
  }, [isLoading])
  return <div className='flex flex-col gap-5 overflow-clip'>
    <p className='text-2xl text-neutral-800 dark:text-neutral-200 font-bold'>Активные сеансы</p>
    <button disabled={pendingAll||pendingOne} className='border border-red-500 dark:border-red-600 max-w-max px-2.5 py-1.25 rounded-md text-red-500 dark:text-red-600 font-medium transition-colors duration-300 ease-out hover:border-red-400 hover:text-red-400 dark:hover:border-red-500 dark:hover:text-red-500 cursor-pointer disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:text-white disabled:border-neutral-300 dark:disabled:border-neutral-700' onClick={()=>deleteAllDevices()}>{pendingAll?'Завершаем другие сеансы':'Завершить другие сеансы'}</button>
    {isLoading?<div className='flex flex-col'><StubDevices/><StubDevices/></div>:
      <div className='flex flex-col'>
        <AnimatePresence mode='popLayout'>
          {devices.map((device, index) => {return <DeviceCard loading={pendingOne || pendingAll} setLoading={setPendingOne} setDevices={setDevices} currentDeviceCardRef={currentDeviceCardRef} baseWidth={baseWidth} key={device.deviceId} index={index} id={device.id} typeDevice={device.deviceType} dId={device.deviceId} currentDeviceId={currentDeviceId.current}/>})}
        </AnimatePresence>
      </div>
    }
  </div>
}