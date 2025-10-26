import AvatarDevice from '@/components/shared/AvatarDevice'
import {animate, motion, useMotionValue, useTransform} from 'framer-motion'
import SmartphoneIcon from '@/components/shared/icons/SmartphoneIcon'
import TabletIcon from '@/components/shared/icons/TabletIcon'
import DesktopIcon from '@/components/shared/icons/DesktopIcon'
import TrashIcon from '@/components/shared/icons/TrashIcon'
import React, {RefObject, useTransition} from 'react'
import useCurrentWidth from '@/hooks/useCurrentWidth'
import {useRouter} from 'next/navigation'
import {DeviceList} from '@/components/ui/DevicesSettings'
import useNotify from '@/hooks/useNotify'

interface IProps {
  index:number;
  typeDevice:string;
  id:string;
  dId:string;
  currentDeviceId:string;
  currentDeviceCardRef:RefObject<HTMLDivElement|null>;
  baseWidth:number;
  setDevices: React.Dispatch<React.SetStateAction<DeviceList[]>>
}
export default function DeviceCard({index, typeDevice, id, dId, currentDeviceId,currentDeviceCardRef, baseWidth, setDevices}: IProps) {
  const avatar = typeDevice === 'mobile'?<SmartphoneIcon/>:typeDevice ==='tablet'?<TabletIcon/>:<DesktopIcon/>
  const x = useMotionValue(0)
  const widthButton = useTransform(x, [0,-40], [0,40])
  const widthCard = useTransform(x, [0, -40], [baseWidth, baseWidth-40])
  const opacityScaleButton = useTransform(x, [0,-40], [0, 1])
  const width = useCurrentWidth()
  const [loading, setLoading] = useTransition()
  const router = useRouter()
  const {setIsNotify, setMessage} = useNotify()
  function dragEnd(){
    const current = x.get()
    const threshold = -40/2
    const target = current<threshold?-40:0
    animate(x, target, {type:'tween'})
  }
  function clickOnCard(){
    const current = x.get()
    animate(x,current<0?0:-40, {type:'tween'})
  }
  async function deleteDevice(id:string){
    setLoading(async ()=>{
      const req = await fetch('/api/deleteDevice', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id:id, dId:dId})
      })
      const res = await req.json()
      if(res.status === 404){
        router.push('/invalid')
      }
      if(res.ok){
        setDevices(prevState => prevState.filter(device => device.id !== id))
      }else {
        setMessage(`Ошибка: ${res.error}`)
        setIsNotify(true)
      }
    })
  }
  return<motion.div layout exit={{opacity:0, x:-width, height:0, padding:0, margin:0}} initial={{y: 2, opacity: 0, scale:0.9}} animate={{y:0, opacity:1, scale:1}} transition={{duration:0.7, type:'tween', delay:index * 0.1}} className={`flex flex-row relative overflow-clip w-full justify-end px-1.25 my-1.25 ${currentDeviceId===dId?'':'cursor-pointer'}`}>
      <motion.div onDragEnd={()=>dragEnd()} onClick={width>1024?()=>clickOnCard():undefined} whileTap={currentDeviceId===dId?undefined:{scaleY:0.95}} ref={currentDeviceId===dId?currentDeviceCardRef:undefined} drag={currentDeviceId===dId?false:width<1024?'x':false} dragConstraints={currentDeviceId===dId?false:{right:0, left:-40}} style={currentDeviceId===dId?undefined:{x, width:widthCard}} dragElastic={currentDeviceId===dId?false:0} dragMomentum={false} className={`transition-colors duration-300 ease-out origin-left flex flex-row items-center gap-2.5 dark:bg-[#282828] bg-neutral-50 p-1.25 rounded-md border border-neutral-300 dark:border-neutral-700 w-full ${currentDeviceId===dId?'':'hover:bg-neutral-100 dark:hover:bg-[#262626]'}`}>
        <AvatarDevice avatar={avatar}/>
        <div className='flex flex-col'>
          <p className='text-lg font-medium select-none text-neutral-800 dark:text-neutral-200'>{typeDevice.charAt(0).toUpperCase() + typeDevice.slice(1).toLowerCase()} устройство</p>
          <p className='text-sm text-neutral-700 dark:text-neutral-300 select-none'>{currentDeviceId===dId&&'Текущее устройство'}</p>
        </div>
      </motion.div>
      {currentDeviceId !== dId && <motion.button disabled={loading} onClick={()=>deleteDevice(id)} whileTap={{scale:0.9}} initial={{scale:1}} transition={{type:'spring'}} style={{width:widthButton, opacity:opacityScaleButton, scale:opacityScaleButton}} className={`bg-red-600 dark:bg-red-700 hover:bg-red-500 dark:hover:bg-red-600 active:bg-red-700 dark:active:bg-red-800 inset-y-0 rounded-md cursor-pointer flex items-center justify-center absolute right-0 transition-colors duration-300 ease-out`}><TrashIcon/></motion.button>}
    </motion.div>
}