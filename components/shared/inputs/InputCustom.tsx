import {IFormInput} from '@/data/formInputs'
import useFormContext from '@/hooks/useFormContext'
import {useParams} from 'next/navigation'
import {AnimatePresence, motion} from 'framer-motion'
import ShowPasswordButton from '@/components/shared/buttons/ShowPasswordButton'
import {useRef} from 'react'

export default function InputCustom({type, placeholder, id, autoComplete, pattern, min, max, reason}: IFormInput) {
  const {handleValidate, isInvalid, isValid} = useFormContext()
  const params = useParams()
  const isEnabledShowPassword = type === 'password'
  const inputRef = useRef<HTMLInputElement>(null)
  return <div className='flex flex-col w-full'>
    <div className='flex flex-row relative items-center'>
      <input ref={isEnabledShowPassword?inputRef:undefined} key={id} name={id} onChange={(e)=>handleValidate(e, id, pattern, min, max)} className={`border w-full rounded-lg p-1 pr-8 z-1 bg-white dark:bg-[#212121] outline-none transition-colors duration-300 ease-in-out ${isInvalid.includes(id)?'border-red-800 focus:border-red-600':isValid.includes(id)?'border-green-700 focus:border-green-500':'border-neutral-300 focus:border-neutral-400 dark:border-neutral-700 dark:focus:border-neutral-600'}`} type={type} placeholder={placeholder} id={id} autoComplete={autoComplete}/>
      {isEnabledShowPassword && <ShowPasswordButton ref={inputRef}/>}
    </div>
    <AnimatePresence>
      {params.type==='register'&&isInvalid.includes(id)&&<motion.span key={`error${id}`} initial={{maxHeight:0, padding:0, opacity:0, fontSize:0}} animate={{maxHeight:450, padding:10, opacity:1, fontSize:'14px'}} exit={{maxHeight:0, padding:0, opacity:0, fontSize:0}} className='-translate-y-1.5 z-0 bg-red-700 text-white font-medium rounded-b-lg overflow-hidden text-balance'>{reason}</motion.span>}
    </AnimatePresence>
  </div>
}