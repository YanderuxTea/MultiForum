'use client'
import {EditorContent} from '@tiptap/react'
import InputToolbar from '@/components/shared/InputToolbar'
import React, {useEffect, useState} from 'react'
import useNotify from '@/hooks/useNotify'
import useCategories from '@/hooks/useCategories'
import useEditorHook from '@/hooks/useEditorHook'
import {useRouter} from 'next/navigation'

export default function InputArea({title, pending, setPending, id}:{title?:string, pending:boolean, setPending:React.TransitionStartFunction, id:string}) {
  const [value, setValue] = useState(()=>{
    try {
      const draft = localStorage.getItem('draft')
      return draft ? JSON.parse(draft) : ''
    }catch{
      return ''
    }
  })
  const {setMessage, setIsNotify} = useNotify()
  const {setCategories} = useCategories()
  const editor = useEditorHook({value: value, setValue:setValue})
  const router = useRouter()
  async function handleSubmit(){
    setPending(async ()=>{
      if((!title||title.trim().length === 0) || editor?.getText().trim().length === 0) {
        setMessage('Ошибка: вы не заполнили поля')
        setIsNotify(true)
        return
      }
      if(title.trim().length>50){
        setMessage('Ошибка: название темы не может быть больше 50 символов')
        setIsNotify(true)
        return
      }
      const req = await fetch('/api/posts/createTheme',{
        method: 'POST',
        body: JSON.stringify({title:title, data:editor?.getJSON(), id:id}),
        headers: {'Content-Type': 'application/json'}
      })
      const res = await req.json()
      if(res.ok){
        setMessage('Успешно')
        setIsNotify(true)
        localStorage.setItem('draft', '')
        setValue('')
        setCategories(prevState => prevState.map((category)=>{
          if(!category.subCategories.some(sub=>sub.id === id)){
            return category
          }
          return {
            ...category,
            subCategories: category.subCategories.map(sub=>{
              if(sub.id !== id) return sub
              return {
                ...sub,
                _count:{
                  ...sub._count,
                  posts:sub._count.posts+1
                },
                posts:[...sub.posts,res.theme]
              }
            })
          }
        }))
        router.push(`/theme/${decodeURIComponent(res.theme.title)}?themeId=${decodeURIComponent(res.theme.id)}&subCategoryId=${decodeURIComponent(res.theme.idSubCategories)}`)
      }else {
        setMessage(`Ошибка: ${res.error}`)
        setIsNotify(true)
      }
    })
  }
  useEffect(() => {
    if(!editor) return
    function save(){
      if(!editor) return
      localStorage.setItem('draft',JSON.stringify(editor.getJSON()))
    }
    editor.on('transaction', save)
    return () => {editor.off('transaction', save)}
  }, [editor])
  return <div className='bg-white dark:bg-[#212121] border border-neutral-300 dark:border-neutral-700 w-full max-w-300 rounded-sm grow p-2.5 flex flex-col gap-2.5'>
    <div className='flex flex-col grow'>
      <InputToolbar pending={pending} editor={editor}/>
      <EditorContent readOnly={pending} editor={editor} className='grow flex break-all'/>
    </div>
    <button disabled={pending} onClick={pending?undefined:()=>handleSubmit()} className='disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 bg-sky-500 dark:bg-sky-600 py-1.25 max-w-max px-2.5 text-white font-medium rounded-md cursor-pointer hover:bg-sky-400 dark:hover:bg-sky-500 active:bg-sky-600 dark:active:bg-sky-700 transition-colors duration-300 ease-out'>Отправить</button>
  </div>
}