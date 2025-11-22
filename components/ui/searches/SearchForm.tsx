'use client'
import React, {useEffect} from 'react'
import {AnimatePresence, motion} from 'framer-motion'
import ParamsSearchCard from '@/components/shared/searches/ParamsSearchCard'
import {searchParams} from '@/data/searchParams'
import {useRouter} from 'next/navigation'
import useLoader from '@/hooks/useLoader'

interface ISearchForm {
  query?: string,
  searchFilter?: string,
}
export default function SearchForm({query, searchFilter}:ISearchForm) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<boolean>(false);
  const router = useRouter()
  const inputRef = React.useRef<HTMLInputElement>(null)
  const {setLoading} = useLoader()
  function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(async ()=>{
      const formObj = new FormData(event.currentTarget)
      const data = Object.fromEntries(formObj)
      if(data.query.toString().trim().length > 0){
        router.push(`/search?query=${data.query.toString().trim()}&searchParams=${data.searchParams}`)
      }else {
        setError(true)
      }
    })
  }
  useEffect(() => {
    if(query){
      if(inputRef.current)inputRef.current.value=query
    }else {
      if(inputRef.current)inputRef.current.value = ''
    }
    if(searchFilter&&searchFilter !== 'All'){
      setIsOpen(true)
    }else if(!searchFilter){
      setIsOpen(false)
    }
  },[query, searchFilter])
  return <form onSubmit={(e)=>submitHandler(e)} className='flex flex-col items-center max-w-200 w-full gap-2.5'>
    <div className='relative w-full'>
      <input type='text' ref={inputRef} className={`border outline-0 relative bg-white dark:bg-[#212121] peer z-1 transition-colors duration-300 ease-out rounded-md p-1.25 w-full ${error?'border-red-600':'border-neutral-500 focus:border-neutral-700 dark:border-neutral-700 dark:focus:border-neutral-500'}`} onChange={(e)=>e.target.value.trim().length>0&&setError(false)} placeholder='Поисковой запрос' name='query' />
      <span className={`absolute inset-0 outline blur-[4px] rounded-md opacity-0 transition-opacity duration-300 ease-out peer-focus:opacity-100 ${error?'outline-red-600':'outline-neutral-700 dark:outline-neutral-500'}`}></span>
      <AnimatePresence>
        {error&&<motion.p initial={{maxHeight:0, paddingBottom:0, paddingTop:0}} animate={{maxHeight:50, paddingBottom:5, paddingTop:5}} exit={{maxHeight:0,paddingBottom:0, paddingTop:0}} transition={{duration:0.3}} className='text-center font-bold text-white bg-red-700 -translate-y-1 rounded-b-md overflow-clip'>Введите запрос в поле</motion.p>}
      </AnimatePresence>
    </div>
    <div className='flex flex-col items-center'>
      <p onClick={()=>setIsOpen(!isOpen)} className={`transition-colors duration-300 ease-out text-lg font-medium cursor-pointer ${isOpen?'text-neutral-800 dark:text-neutral-200':'text-neutral-600 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>Параметры поиска</p>
    </div>
      {!isOpen&& <input type='radio' className='hidden' name='searchParams' value='All' defaultChecked={true}/>}
    <AnimatePresence>
      {isOpen&&<motion.div initial={{height:0}} animate={{height:'auto'}} exit={{height:0}} className='flex flex-col w-full overflow-clip'>
        <div className='flex flex-col gap-2.5'>
          <p className='text-neutral-900 dark:text-neutral-100'>Где искать:</p>
          {searchParams.map((param, index) => {return<ParamsSearchCard key={index} value={param.value} title={param.title} searchFilter={searchFilter}/>})}
        </div>
      </motion.div>}
    </AnimatePresence>
    <div className='flex justify-center lg:justify-end w-full border-t py-2.5 border-neutral-300 dark:border-neutral-700'>
      <button type='submit' className='bg-blue-500 dark:bg-blue-600 text-white cursor-pointer py-1.25 rounded-md font-medium w-full lg:max-w-40 transition-colors duration-300 ease-out hover:bg-blue-400 active:bg-blue-600 dark:hover:bg-blue-500 dark:active:bg-blue-700'>Поиск</button>
    </div>
  </form>
}