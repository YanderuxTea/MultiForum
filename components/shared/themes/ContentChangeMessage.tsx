import {EditorContent} from '@tiptap/react'
import useEditorHook from '@/hooks/useEditorHook'
import {JSONContent} from '@tiptap/core'
import React from 'react'
import InputToolbar from '@/components/shared/InputToolbar'
import {IMessage} from '@/context/CategoriesContext'
import useNotify from '@/hooks/useNotify'
import isEqual from 'fast-deep-equal'


export default function ContentChangeMessage({pending, props, setChange, setChangeParent, setPending, setMessages}:{pending:boolean, props:IMessage, setChange:React.Dispatch<React.SetStateAction<boolean>>, setChangeParent:React.Dispatch<React.SetStateAction<boolean>>, setPending:React.TransitionStartFunction, setMessages:React.Dispatch<React.SetStateAction<IMessage[]|undefined>>}) {
  const [value, setValue] = React.useState<JSONContent|string>(props.text)
  const editor = useEditorHook({value:value, setValue:setValue})
  const {setMessage, setIsNotify} = useNotify()
  async function changeMessage(){
    if(!editor){
      return
    }
    if(editor?.getText().trim().length===0 || typeof value === 'string'){
      setMessage('Ошибка: вы оставили поле пустым')
      setIsNotify(true)
      return
    }
    const doc1 = JSON.parse(JSON.stringify(value))
    const doc2 = JSON.parse(JSON.stringify(props.text))
    if(isEqual(doc1, doc2)){
      setMessage('Ошибка: вы ничего не изменили')
      setIsNotify(true)
      return
    }
    setPending(async ()=>{
      const req = await fetch('/api/categories/changeMessage', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({data:value, id:props.id, idUser:props.idUser, beforeText:props.text})
      })
      const res = await req.json()
      if(res.status === 429){
        setMessage(`Ошибка: вы сможете изменять сообщения через ${res.error} секунд`)
        setIsNotify(true)
        return
      }
      if(res.ok){
        setMessages(prevState => (prevState||[]).map((mess)=>{
          if(props.id !== mess.id){
            return mess
          }
          return {
            ...mess,
            text:doc1,
            ...mess.HistoryMessage,
            HistoryMessage:[
              {updateAt:res.history.updateAt}
            ]
          }
        }))
        setChange(prevState=>!prevState)
        setChangeParent(prevState=>!prevState)
      }else {
        setMessage(`Ошибка: ${res.error}`)
        setIsNotify(true)
      }
    })
  }
  return <div className='w-full p-5 flex flex-col gap-2.5'>
    <div className='flex flex-col'>
      <InputToolbar editor={editor} pending={pending}/>
      <EditorContent editor={editor}/>
    </div>
    <div className='flex justify-end w-full gap-2.5'>
      <button disabled={pending} onClick={()=>{
        setChangeParent(prevState => !prevState)
        setChange(prevState => !prevState)
      }} className='disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 px-2.5 py-1.25 rounded-md cursor-pointer font-medium transition-colors duration-300 ease-out max-w-max border-2 border-neutral-300 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300 active:bg-neutral-300 dark:active:bg-neutral-700 active:border-neutral-300 dark:active:border-neutral-700'>Отменить</button>
      <button onClick={pending?undefined:()=>changeMessage()} disabled={pending} className='disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 bg-orange-500 dark:bg-orange-600 px-2.5 py-1.25 rounded-md cursor-pointer font-medium text-white hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 transition-colors duration-300 ease-out max-w-max'>Изменить</button>
    </div>
  </div>
}