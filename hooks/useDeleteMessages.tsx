import {IMessage} from '@/context/CategoriesContext'
import React from 'react'
import useNotify from '@/hooks/useNotify'

export default function useDeleteMessages({props, setMessages}:{props:IMessage, setMessages: React.Dispatch<React.SetStateAction<IMessage[]|undefined>>}) {
  const {setMessage, setIsNotify} = useNotify()
  return async function deleteMessages(){
    const req = await fetch('/api/categories/deleteMessage',{
      method:'POST',
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({id:props.id})
    })
    const res = await req.json()
    if(res.ok){
      setMessage(res.message)
      setIsNotify(true)
      setMessages(prevState => (prevState||[]).map((mess)=>{
        if(props.idUser === mess.idUser){
          return {
            ...mess,
            Users:{
              ...mess.Users,
              _count:{
                ...mess.Users._count,
                MessagesPosts:mess.Users._count.MessagesPosts-1
              }
            },
            Posts:{
              ...mess.Posts,
              _count:{
                ...mess.Posts._count,
                MessagesPosts:mess.Posts._count.MessagesPosts-1
              }
            }
          }
        }
        return mess
      }))
      setMessages(prevState => (prevState||[]).filter((mess)=>mess.id !== props.id))
    }else {
      setMessage(`Ошибка: ${res.error}`)
      setIsNotify(true)
    }
  }
}