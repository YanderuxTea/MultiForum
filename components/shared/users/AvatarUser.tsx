import nullAvatar from '@/public/svg/user.svg'
import Image from 'next/image'
import React from 'react'

interface IAvatarProps {
  avatar?: string,
  role: string,
  width:number,
  height:number,
}
export default function AvatarUser({props}:{props:IAvatarProps}) {
  const avatar = props.avatar?props.avatar: nullAvatar
  const isGif = props.avatar?props.avatar.toLowerCase().endsWith('.gif'):false
  return <Image src={avatar} draggable={false} unoptimized={isGif} priority alt='Profile avatar' width={props.width} height={props.height} className={`outline-2 aspect-square rounded-full bg-white ${props.role==='Admin'?'outline-red-600':props.role==='Moderator'?'outline-blue-700':'outline-gray-500'}`} style={{width:props.width, height:props.height}}/>
}
