import {Editor} from '@tiptap/core'
import React from 'react'
import InputAny from '@/components/shared/inputs/InputAny'
import useNotify from '@/hooks/useNotify'

export default function VideoContent({editor, setIsOpenMenu}:{editor:Editor|null, setIsOpenMenu:React.Dispatch<React.SetStateAction<boolean>>}) {
  const [value, setValue] = React.useState('')
  const {setIsNotify, setMessage} = useNotify()
  function insertVideo(){
    if(value.trim().length === 0){
      setMessage('Ошибка: вы не вставили ссылку на видео')
      setIsNotify(true)
    }else if(!value.trim().includes('youtu')){
      setMessage('Ошибка: некорректная ссылка')
      setIsNotify(true)
    }else {
      if(!editor)return
      setIsOpenMenu(false)
      document.body.style.overflow = 'unset'
      editor.chain().focus().insertContent([
        {
          type: 'youtube',
          attrs:{
            src: value.trim(),
          }
        },
        {
          type: 'paragraph',
        }
      ]).run()
    }
  }
  return <div className='mt-2.5 flex flex-col gap-2.5'>
    <p className='font-bold text-xl text-neutral-900 dark:text-neutral-100 text-center'>Вставка видео</p>
    <InputAny placeholder='Вставьте ссылку на видео' id='pasteUrlVideo' name='urlVideo' type='text' value={value} onChange={(val)=>{setValue(val)}}/>
    <button onClick={()=>insertVideo()} className='bg-orange-500 dark:bg-orange-600 py-1.25 rounded-md text-white font-medium transition-colors duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 cursor-pointer select-none'>Вставить</button>
  </div>
}