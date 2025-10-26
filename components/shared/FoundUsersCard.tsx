'use client'
import {IFoundUsers} from '@/components/ui/FoundUsers'
import Image from 'next/image'
import nullAvatar from '@/public/svg/user.svg'
import useCurrentWidth from '@/hooks/useCurrentWidth'
import Link from 'next/link'

export default function FoundUsersCard({user}: { user:IFoundUsers }) {
  const isGif = typeof user.avatar === 'string' && user.avatar.toLowerCase().endsWith('.gif')
  const avatar = user.avatar || nullAvatar
  const width = useCurrentWidth()
  return <Link href={`/profile/${user.login}`} className='transition-colors duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-800 flex flex-row items-center bg-white dark:bg-[#212121] p-2.5 rounded-md border border-neutral-300 dark:border-neutral-700 gap-2.5'>
    <Image src={avatar} alt='Avatar' draggable={false} unoptimized={isGif}  width={width>=1024?64:40} height={width>=1024?64:40} className={`w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-white outline-2 ${user.role==='Admin'?'outline-red-600':user.role==='Moderator'?'outline-blue-700':'outline-gray-500'}`}/>
    <p className={`font-medium ${user.role==='Admin'?'text-red-600':user.role==='Moderator'?'text-[#00BE00]':'text-neutral-700 dark:text-neutral-300'}`}>{user.login}</p>
  </Link>
}