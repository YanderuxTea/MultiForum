'use client'
import {JSX, useEffect, useRef, useState} from 'react'
import nullAvatar from '@/public/svg/user.svg'
import Image from 'next/image'
import useDataUser from '@/hooks/useDataUser'
import Camera from '@/components/shared/icons/Camera'
import useChoosePhoto from '@/hooks/useChoosePhoto'
import ChoosePhotoForm from '@/components/ui/profiles/ChoosePhotoForm'
import {AnimatePresence} from 'framer-motion'
import MenuWindow from '@/components/ui/menus/MenuWindow'
import CheckNameplateUser from '@/components/shared/users/CheckNameplateUser'
import ColorNicknameUser from '@/components/shared/users/ColorNicknameUser'
import CheckBanned from '@/components/shared/users/CheckBanned'
import OpenMenuAdminsPanelProvider from '@/components/providers/OpenMenuAdminsPanelProvider'

interface IProfileProps{
  login: string,
  role: string,
  createdAt: Date,
  avatar: string|null,
  bans: {
    date: Date
    time: number
  }[]
  _count: {
    warns: number
    bans: number
    Posts: number
    MessagesPosts: number
  }
}
export default function Profile({props}: { props:IProfileProps }): JSX.Element {
  const formatter = new Intl.DateTimeFormat('ru-RU',{day:'numeric', month:'long', year:'numeric'})
  const formattedDate = formatter.format(new Date(props.createdAt))
  const [avatar, setAvatar] = useState<string>(props.avatar?props.avatar:nullAvatar)
  const isGif = useRef<boolean>(typeof props.avatar === 'string' && props.avatar.toLowerCase().endsWith('.gif'))
  const dataUser = useDataUser()
  const choosePhoto = useChoosePhoto()
  const activeBan = props.bans.length >0 ? new Date(props.bans[0].date).getTime() + props.bans[0].time*60*1000 > Date.now() || props.bans[0].time === 0:false
  useEffect(() => {
    isGif.current = typeof props.avatar === 'string' && props.avatar.toLowerCase().endsWith('.gif')
  }, [avatar])
  return <div className='grid grid-cols-1 grid-rows-[2fr_1fr_5fr] w-full gap-5 lg:grid-cols-[1fr_3.5fr] lg:grid-rows-[1fr_3fr] lg:min-h-screen max-w-300 px-2.5 py-5 xl:px-0 max-h-screen'>
    <AnimatePresence>
      <OpenMenuAdminsPanelProvider>
        <AnimatePresence>
          {choosePhoto.isChoosePhoto&&<MenuWindow props={{setIsOpenMenu: choosePhoto.setIsChoosePhoto,isOpenMenu:choosePhoto.isChoosePhoto, setIsHelp: choosePhoto.setIsHelp, content:<ChoosePhotoForm avatar={avatar} setAvatar={setAvatar}/>}}/>}
        </AnimatePresence>
      </OpenMenuAdminsPanelProvider>
    </AnimatePresence>
    <div className='w-full mx-auto flex items-center justify-center flex-col gap-2.5 bg-white dark:bg-[#212121] p-2.5 rounded-md border border-neutral-300 dark:border-neutral-700'>
      <ColorNicknameUser user={{role:props.role, login:props.login}} fontSize={20} fontWeight={700}/>
      {dataUser && dataUser.login === props.login
        ?
        <div className={`relative rounded-full outline-2 overflow-clip bg-white ${props.role==='Admin'?'outline-red-600':props.role==='Moderator'?'outline-blue-700':'outline-gray-500'}`}>
          <Image src={avatar} alt='Profile avatar' draggable={false} width={128} height={128} onError={()=>setAvatar(nullAvatar)} className={`w-32 h-32 aspect-square`} priority unoptimized={isGif.current}/>
          <div className='absolute inset-0 p-1.25 flex items-center justify-center bg-black/25 dark:bg-black/50 transition-opacity duration-300 ease-out opacity-0 hover:opacity-100 select-none cursor-pointer' onClick={()=>choosePhoto.setIsChoosePhoto(true)}>
            <Camera/>
          </div>
        </div>
        :
        <Image src={avatar} alt='Profile avatar' draggable={false} width={128} height={128} onError={()=>setAvatar(nullAvatar)} className={`bg-white outline-2 rounded-full w-32 h-32 aspect-square ${props.role==='Admin'?'outline-red-600':props.role==='Moderator'?'outline-blue-700':'outline-gray-500'}`} priority unoptimized={isGif.current}/>}
      <p className='text-balance text-center font-medium text-neutral-600 dark:text-neutral-300 max-w-57.5'>Дата регистрации: {formattedDate}</p>
      {activeBan&&<CheckBanned/>}
      <CheckNameplateUser role={props.role}/>
    </div>
    <div className='bg-white p-2.5 dark:bg-[#212121] rounded-md border border-neutral-300 dark:border-neutral-700 flex flex-col max-w-300 mx-auto w-full gap-2.5 lg:col-start-1 lg:row-start-2 max-h-max'>
      <p className='text-lg font-bold text-neutral-700 dark:text-neutral-200'>Общая информация</p>
      <p className='font-medium text-neutral-600 dark:text-neutral-400'>Сообщений: {props._count.MessagesPosts+props._count.Posts}</p>
      <p className='font-medium text-neutral-600 dark:text-neutral-400'>Количество активных предупреждений: {props._count.warns%3}/3</p>
      <p className='font-medium text-neutral-600 dark:text-neutral-400'>Количество всех предупреждений: {props._count.warns}</p>
      <p className='font-medium text-neutral-600 dark:text-neutral-400'>Количество блокировок: {props._count.bans}</p>
    </div>
    <div className='bg-white p-2.5 dark:bg-[#212121] rounded-md border border-neutral-300 dark:border-neutral-700 flex flex-col max-w-300 mx-auto w-full overflow-hidden lg:col-start-2 lg:row-start-1 lg:row-span-2'>
      <div className='pb-2.5 relative after:absolute after:inset-0 after:border-b-10 after:blur-[2px] after:border-white dark:after:border-[#212121] after:translate-y-1 after:scale-x-105'>
        <p className='text-lg font-bold text-neutral-700 dark:text-neutral-200'>Активность</p>
      </div>
      <div className={`flex flex-col overflow-y-auto ${props._count.Posts||props._count.MessagesPosts>0?'':'items-center justify-center h-full'}`}>
        {props._count.Posts||props._count.MessagesPosts>0?null: <p className='font-medium text-neutral-700 dark:text-neutral-200'>Нет активности :(</p>}
      </div>
    </div>
  </div>
}