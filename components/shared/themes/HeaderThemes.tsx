import AvatarUser from '@/components/shared/users/AvatarUser'
import Link from 'next/link'
import ColorNicknameUser from '@/components/shared/users/ColorNicknameUser'
import React from 'react'
import {IMessage} from '@/context/CategoriesContext'
import useCurrentWidth from '@/hooks/useCurrentWidth'

export default function HeaderThemes({messages}:{messages:IMessage[]}) {
  const currentWidth = useCurrentWidth()
  const convertedDate = Intl.DateTimeFormat('ru-RU',{dateStyle:'long'}).format(new Date(messages.length>0?messages[0].Posts.createdAt:Date.now())).replace('г.', '')
  return <div className='bg-white dark:bg-[#212121] p-2.5 border border-neutral-300 gap-2.5 dark:border-neutral-700 rounded-md flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700 break-all'>
    <p className='text-lg font-bold text-neutral-900 dark:text-neutral-100 pb-2.5 lg:text-xl'>{messages.length>0&&messages[0].Posts.title}</p>
    <div className='flex flex-row items-center gap-2.5'>
      <div className='hidden lg:block'>
        <AvatarUser props={{role:messages.length>0?messages[0].Posts.user.role:'', avatar:(messages.length>0?messages[0].Posts.user.avatar:'')??undefined, width:50, height:50}}/>
      </div>
      <div>
        <span className='gap-1.25 flex flex-row items-center text-sm lg:text-[16px] text-neutral-700 dark:text-neutral-300 font-medium'>
          <p>Автор:</p> <Link href={`/profile/${messages.length>0&&messages[0].Posts.user.login}`}><ColorNicknameUser user={{role:messages.length>0?messages[0].Posts.user.role:'', login:messages.length>0?messages[0].Posts.user.login:''}} fontSize={currentWidth<1024?14:16} fontWeight={500}/></Link>
        </span>
        <p className='text-sm text-neutral-500 dark:text-neutral-400 font-medium'>Опубликовано: {convertedDate}</p>
      </div>
    </div>
  </div>

}