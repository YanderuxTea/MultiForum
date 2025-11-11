'use client'
import React, {useEffect, useRef, useState} from 'react'
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
    {isLoading?<div className='flex flex-col'><StubDevices/><StubDevices/></div>:
      <div className='flex flex-col'>
        <AnimatePresence mode='popLayout'>
          {devices.map((device, index) => {return <DeviceCard setDevices={setDevices} currentDeviceCardRef={currentDeviceCardRef} baseWidth={baseWidth} key={device.deviceId} index={index} id={device.id} typeDevice={device.deviceType} dId={device.deviceId} currentDeviceId={currentDeviceId.current}/>})}
        </AnimatePresence>
      </div>
    }
  </div>
}