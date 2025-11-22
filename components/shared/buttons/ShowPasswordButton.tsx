import Eye from '@/components/shared/icons/Eye'
import {RefObject, useState} from 'react'
import EyeOff from '@/components/shared/icons/EyeOff'

export default function ShowPasswordButton({ref}:{ref:RefObject<HTMLInputElement|null>}) {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  function handleShowPassword(){
    if(showPassword && ref.current){
      setShowPassword(prevState => !prevState)
      ref.current.type = 'password'
    }else if(!showPassword && ref.current) {
      setShowPassword(prevState => !prevState)
      ref.current.type = 'text'
    }
  }
  return <button type='button' onClick={()=>handleShowPassword()} className='absolute right-1.25 z-1 cursor-pointer'>
    {showPassword?<Eye/>:<EyeOff/>}
  </button>
}