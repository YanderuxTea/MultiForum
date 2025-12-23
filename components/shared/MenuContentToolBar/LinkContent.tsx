import {Editor} from '@tiptap/core'
import React from 'react'
import InputAny from '@/components/shared/inputs/InputAny'
import useNotify from '@/hooks/useNotify'

export default function LinkContent({editor, setIsOpenMenu}: {editor: Editor|null, setIsOpenMenu: React.Dispatch<React.SetStateAction<boolean>>}) {
  const {setMessage, setIsNotify} = useNotify()
  const [value,setValue] = React.useState({
    url:'',
    text:''
  })
  function insertUrl(){
    if(!editor)return
    if(value.url.trim().length===0){
      setIsNotify(true)
      setMessage('Ошибка: вы не вставили ссылку')
    }else {
      document.body.style.overflow = 'unset'
      const insertText = value.text.length>0?value.text:value.url
      setIsOpenMenu(false)
      editor.chain().focus().insertContent({
        type: 'text',
        text: insertText,
        marks: [
          {
            type: 'link',
            attrs:{
              href: value.url,
              target: '_blank',
            }
          }
        ]
      }).unsetMark('link').insertContent(' ').run()
    }
  }
  return <div className='mt-2.5 flex flex-col gap-2.5'>
    <p className='font-bold text-xl text-center text-neutral-900 dark:text-neutral-100'>Вставка ссылки</p>
    <InputAny id='textUrl' placeholder='Введите текст' value={value.text} onChange={(val)=>{setValue(prevState => ({...prevState, text:val.trim()}))}}/>
    <InputAny id='urlPaste' placeholder='Вставьте ссылку' value={value.url} onChange={(val)=>{setValue(prevState => ({...prevState, url:val.trim()}))}}/>
    <button onClick={()=>insertUrl()} className='bg-orange-500 dark:bg-orange-600 py-1.25 rounded-md text-white font-medium transition-colors duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 cursor-pointer select-none'>Вставить</button>
  </div>
}