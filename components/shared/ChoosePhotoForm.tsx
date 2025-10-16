'use client'
import {AnimatePresence, motion} from 'framer-motion'
import useChoosePhoto from '@/hooks/useChoosePhoto'
import React, {useEffect, useRef, useState, useTransition} from 'react'
import ExitIcon from '@/components/shared/icons/ExitIcon'
import InputAny from '@/components/shared/InputAny'
import Image from 'next/image'
import useDataUser from '@/hooks/useDataUser'
import nullAvatar from '@/public/svg/user.svg'
import useNotify from '@/hooks/useNotify'

interface IPhotoProps{
  avatar:string
  setAvatar: React.Dispatch<React.SetStateAction<string>>
}
export default function ChoosePhotoForm({avatar, setAvatar}:IPhotoProps) {
  const choosePhoto = useChoosePhoto()
  const backdropRef = useRef<HTMLDivElement>(null)
  const [url, setUrl] = useState<string>(typeof avatar === 'object'?'':avatar)
  const [validUrl, setValidUrl] = useState<boolean>(false)
  const dataUser = useDataUser()
  const [isHelp, setIsHelp] = useState<boolean>(false)
  const {setIsNotify, setMessage} = useNotify()
  const [isLoading, setIsLoading] = useTransition()
  async function changeAvatar(){
    setIsLoading(async ()=>{
      const req = await fetch('/api/changeAvatar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({url:url})
      })
      const res = await req.json()
      if(res.ok){
        setMessage(res.message)
        setIsNotify(true)
        setAvatar(url!==''?url:nullAvatar)
      }else {
        if(res.error){
          setMessage(`Ошибка: ${res.error}`)
          setIsNotify(true)
        }else if(res.issues){
          setMessage(`Ошибка: ${res.issues[0].message}`)
          setIsNotify(true)
        }
      }
    })
  }
  useEffect(() => {
    function closeHandle(e:MouseEvent){
      if(e.target===backdropRef.current){
        choosePhoto.setIsChoosePhoto(false)
        setIsHelp(false)
      }
    }
    window.addEventListener('click', closeHandle)
    return () => {window.removeEventListener('click', closeHandle)}
  }, [])
  useEffect(() => {
    if(!url){
      setValidUrl(false)
      return
    }
    const regex = /^https:\/\/i\.imgur\.com\/[a-zA-Z0-9]+\.(gif|png|jpe?g)$/i
    try {
      if(regex.test(url)){
        const img = new window.Image()
        img.src = new URL(url, window.location.origin).href
        img.alt = 'Preview'
        img.onload = ()=> setValidUrl(true)
        img.onerror = ()=> setValidUrl(false)
      }else {
        setValidUrl(false)
      }
    }catch(err){
      setValidUrl(false)
    }
  }, [url])
  return <AnimatePresence>
    {choosePhoto.isChoosePhoto&&<motion.div ref={backdropRef} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className='px-2.5 flex items-center justify-center fixed inset-0 z-100 bg-black/50 backdrop-blur-sm'>
      <div className='w-full flex flex-col relative max-w-100 p-5 bg-white rounded-xl border border-neutral-300 dark:bg-[#212121] dark:border-neutral-700'>
        <div className='flex flex-col gap-5'>
          <button onClick={()=> {
            choosePhoto.setIsChoosePhoto(false); setIsHelp(false)
          }} className='cursor-pointer absolute right-1.25 top-1.25 group'><ExitIcon/></button>
          <p className='mt-2.5 font-bold text-center text-lg text-neutral-700 dark:text-neutral-200'>Смена аватарки</p>
          <InputAny type='text' value={url} onChange={setUrl} id='urlPhotoInput' placeholder='Вставьте вашу ссылку'/>
          <div className='flex flex-col gap-5 h-35 items-center justify-center'>
            {validUrl?url.length>0&&
              <Image draggable={'false'} src={url} alt='Preview Photo' className={`w-32 outline-2 aspect-square mx-auto rounded-full ${dataUser&&dataUser.role==='Admin'?'outline-red-600':dataUser&&dataUser.role==='Moderator'?'outline-blue-700':'outline-gray-500'}`} unoptimized={url.endsWith('.gif')} width={128} height={128}/>
              : url.length>0&&
              <p className={`text-center text-balance rounded-full w-32 aspect-square outline-2 items-center flex text-red-600 font-medium ${dataUser&&dataUser.role==='Admin'?'outline-red-600':dataUser&&dataUser.role==='Moderator'?'outline-blue-700':'outline-gray-500'}`}>Картинка неправильно загружена</p>}
            {url.length<1&& <p className={`overflow-clip text-center text-balance rounded-full outline-2 w-32 aspect-square items-center flex text-sm text-neutral-700 font-medium dark:text-neutral-300 ${dataUser&&dataUser.role==='Admin'?'outline-red-600':dataUser&&dataUser.role==='Moderator'?'outline-blue-700':'outline-gray-500'}`}><Image className='bg-white' width={128} height={128} src={nullAvatar} alt='Null Avatar'/></p>}
          </div>
          <div className='flex flex-row gap-1.25 relative w-full'>
            <button disabled={isLoading} onClick={()=>changeAvatar()} className='w-full select-none font-medium p-1.25 rounded-md bg-blue-500 hover:bg-blue-400 dark:bg-blue-600 dark:hover:bg-blue-500 active:bg-blue-600 dark:active:bg-blue-700 transition-colors duration-300 ease-out text-white cursor-pointer text-center disabled:bg-gray-500/25 disabled:text-black/25 dark:disabled:text-white/25 dark:disabled:bg-gray-100/25 disabled:cursor-default'>
              <p>{isLoading?'Меняем':'Сменить'}</p>
            </button>
          </div>
          <p onClick={()=>setIsHelp(prevState => !prevState)} className='text-[15px] flex flex-row justify-center items-center font-medium text-neutral-500 select-none cursor-pointer dark:text-neutral-400 transition-colors duration-300 ease-out'>Не знаете как сменить?</p>
        </div>
        <AnimatePresence>
          {isHelp && <motion.div className='overflow-hidden' initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} key={'ListHelp'} >
            <ol className='list-decimal list-inside text-neutral-500 font-medium dark:text-neutral-400 text-sm flex gap-1.25 flex-col'>
              <li className='text-justify'>Загрузите аватарку на сайте <span className='font-bold'>imgur.com</span>.</li>
              <li className='text-justify'>Получите <span className='font-bold'>прямую ссылку</span> на файл. На imgur это можно сделать, нажав 3 точки → <span className='font-bold'>Get share links</span> → <span className='font-bold'>BBCode (Forums)</span> <span className='font-bold underline underline-offset-4'>без [img]</span>. Ссылка должна заканчиваться на <span className='font-bold'>.png, .jpg/.jpeg или .gif</span>.</li>
              <li className='text-justify'>Вставьте эту ссылку в поле и нажмите кнопку <span className='font-bold'>сменить</span>.</li>
            </ol>
          </motion.div>}
        </AnimatePresence>
      </div>
    </motion.div>}
  </AnimatePresence>
}
