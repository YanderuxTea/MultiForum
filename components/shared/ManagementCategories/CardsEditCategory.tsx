import {ICategories} from '@/context/CategoriesContext'
import IconCheck from '@/components/shared/icons/IconCheck'
import React from 'react'
import useNotify from '@/hooks/useNotify'
import useCategories from '@/hooks/useCategories'

export default function CardsEditCategory({props, pending, setPending}:{props:ICategories, pending:boolean, setPending:React.TransitionStartFunction}) {
  const {setIsNotify, setMessage} = useNotify()
  const {setCategories} = useCategories()
  const [newTitle, setNewTitle] = React.useState(props.title)
  async function editCategories(){
    setPending(async ()=>{
      if(props.title.trim() === newTitle.trim()){
        setIsNotify(true)
        setMessage('Ошибка: вы не ввели новое название')
        return
      }else {
        const req = await fetch('/api/categories/edit', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({id:props.id, title:newTitle.trim()}),
        })
        const res = await req.json()
        if(res.ok){
          setCategories(prevState => prevState.map((c)=>{
            if(c.id === props.id){
              return {...c, title:newTitle.trim() }
            }
            return c
          }))
          setIsNotify(true)
          setMessage(res.message)
        }else {
          setIsNotify(true)
          setMessage(`Ошибка: ${res.message}`)
        }
      }
    })
  }
  return <div className='flex flex-row justify-between'>
    <input type='text' id={props.id} disabled={pending} defaultValue={props.title} onChange={(e)=>setNewTitle(e.target.value)} className='outline-none border w-[85%] border-neutral-300 dark:border-neutral-700 rounded-md px-1.25 focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors duration-300 ease-out'/>
    <button onClick={()=>editCategories()} disabled={pending} className='cursor-pointer transition-colors duration-300 ease-out hover:bg-green-400 dark:hover:bg-green-500 active:bg-green-600 dark:active:bg-green-700 flex items-center justify-center bg-green-500 dark:bg-green-600 p-1.25 rounded-md disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 select-none'><IconCheck/></button>
  </div>
}