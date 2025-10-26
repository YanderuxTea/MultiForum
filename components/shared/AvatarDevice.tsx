import {JSX} from 'react'

interface IProps {
  avatar:JSX.Element
}
export default function AvatarDevice({avatar}: IProps) {
  return <div className='bg-blue-500 dark:bg-blue-600 w-10 aspect-square rounded-full flex items-center justify-center'>
    {avatar}
  </div>
}