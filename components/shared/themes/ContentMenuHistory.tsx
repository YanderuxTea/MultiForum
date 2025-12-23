import React, {useEffect, useMemo} from 'react'
import {IHistoryMessages} from '@/context/CategoriesContext'
import useLoader from '@/hooks/useLoader'
import useNotify from '@/hooks/useNotify'
import Pagination from '@/components/shared/Pagination'
import CardHistoryMessage from '@/components/shared/themes/CardHistoryMessage'

export default function ContentMenuHistory({id}: {id:string}) {
  const [history, setHistory] = React.useState<IHistoryMessages>()
  const {setLoading} = useLoader()
  const [pageNumber, setPageNumber] = React.useState<number>(0)
  const {setMessage, setIsNotify} = useNotify()
  const totalPage = useMemo(()=>{
    return history?Math.ceil(history._count.HistoryMessage/5):0
  },[history])
  useEffect(() => {
    if(!id) return
    setLoading(async ()=>{
      const req = await fetch('/api/categories/getHistory',{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({id:id, pageNumber:pageNumber}),
      })
      const res = await req.json()
      if(res.ok){
        setHistory(res.data)
      }else {
        setMessage(`Ошибка: ${res.error}`)
        setIsNotify(true)
      }
    })
  }, [pageNumber, id])
  return <div className='mt-2.5 flex flex-col gap-2.5 break-all'>
    <p className='text-center font-bold text-neutral-900 dark:text-neutral-100 text-lg'>Просмотр истории</p>
    <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalPages={totalPage} count={history?history._count.HistoryMessage:0} id='Head'/>
    <div className='flex flex-col gap-2.5'>
      {history&&history.HistoryMessage.map((mess)=>{
        return <CardHistoryMessage props={mess} key={mess.id}/>
      })}
    </div>
    <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalPages={totalPage} count={history?history._count.HistoryMessage:0} id='Footer'/>
  </div>
}