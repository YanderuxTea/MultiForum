'use client'
import SearchIcon from '@/components/shared/icons/SearchIcon'
import React, {FormEvent, useEffect, useRef} from 'react'
import {searchParams} from '@/data/searchParams'
import {AnimatePresence, motion} from 'framer-motion'
import {useRouter} from 'next/navigation'

export default function UnderHeader() {
  const [filter, setFilter] = React.useState<{title:string, value:string}>({title:'Везде', value:'All'})
  const [open, setOpen] = React.useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const url = useRef<string>('/search');
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  useEffect(() => {
    function handleClose(e: MouseEvent|TouchEvent) {
      if(formRef.current&&!formRef.current.contains(e.target as Node)){
        setOpen(false);
      }
    }
    window.addEventListener('click', handleClose)
    return () => {window.removeEventListener('click', handleClose)}
  }, [])
  function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    if(data.query.toString().trim().length > 0){
      url.current=`/search?query=${data.query.toString().trim()}&searchParams=${filter.value}`
      router.push(url.current)
      if (inputRef.current)inputRef.current.value = ''
      setFilter({title:'Везде', value:'All'})
      url.current='/search'
    }else {
      router.push(url.current)
      setFilter({title:'Везде', value:'All'})
    }
  }
  return<nav className='bg-orange-500 z-2 dark:bg-orange-600 w-full p-2.5 fixed translate-y-13 md:translate-y-14.25 flex justify-center'>
      <div className='max-w-300 w-full flex justify-end flex-row items-center '>
        <form ref={formRef} onSubmit={(e)=>submit(e)} className='flex flex-row items-center rounded-md lg:bg-white w-81.25 justify-end'>
          <input type='text' ref={inputRef} placeholder='Поиск...' className='p-1.25 outline-none text-neutral-800 hidden lg:block max-w-38' autoComplete='off' name='query' id='query' />
          <div className='text-neutral-800 hidden lg:block relative'>
            <p className='p-1.25 w-32.5 text-center cursor-pointer select-none hover:bg-neutral-200 text-neutral-600 transition-colors duration-300 ease-out' onClick={()=>setOpen(!open)}>{filter.title}</p>
            <AnimatePresence>
              {open&&<motion.div initial={{opacity:1}} exit={{opacity:0}}>
                <div className='w-2.5 rotate-45 aspect-square bg-white border-neutral-300 border-l border-t z-1 translate-y-1.25 absolute right-1.25'></div>
                <ul className='absolute bg-white border-x border-b border-neutral-300 shadow-md cursor-pointer select-none p-2.5 flex flex-col rounded-md w-50 translate-y-2.5 -translate-x-1/3'>
                  {searchParams.map((item, index) => {
                    return <li key={index}
                               onClick={() => {
                                 setFilter({title: item.title, value: item.value});setOpen(false);
                               }} className={`rounded-md transition-colors duration-300 ease-out  indent-2 py-0.25 ${item.value===filter.value?'bg-orange-500 dark:bg-orange-600 text-white':'hover:bg-neutral-200'}`}>{item.title}</li>
                  })}
                </ul>
              </motion.div>}
            </AnimatePresence>
          </div>
          <button type='submit' className='group lg:p-1.25 hover:bg-neutral-200 transition-colors duration-300 ease-out rounded-r-md cursor-pointer'><SearchIcon/></button>
        </form>
      </div>
    </nav>
}