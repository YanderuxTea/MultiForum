import {Editor} from '@tiptap/core'
import React from 'react'
import InputAny from '@/components/shared/inputs/InputAny'
import useNotify from '@/hooks/useNotify'

export default function ImageContent({editor, setIsOpenMenu}:{editor:Editor|null, setIsOpenMenu:React.Dispatch<React.SetStateAction<boolean>>}) {
  const [value, setValue] = React.useState<string>('')
  const {setIsNotify, setMessage} = useNotify()
  function insertImage(){
    const allowed = ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    if(value.trim().length === 0){
      setMessage('Ошибка: вы не вставили картинку')
      setIsNotify(true)
    }else if (!value.trim().includes('imgur') || !allowed.some((allowed)=>value.trim().endsWith(allowed))){
      setMessage('Ошибка: некорректная ссылка')
      setIsNotify(true)
    }else {
      if(!editor) return
      setIsOpenMenu(false)
      document.body.style.overflow = 'unset'
      editor.chain().focus().insertContent([
        {
          type: 'image',
          attrs:{
            src: value.trim(),
            alt:'',
            width:400,
            height:300,
          }
          },
          {
            type: 'paragraph',
          }],
        ).run()
    }
  }
  return <div className='mt-2.5 flex flex-col gap-2.5'>
    <p className='text-lg text-neutral-900 dark:text-neutral-100 font-bold text-center'>Вставка изображения</p>
    <InputAny id='pasteImageUrl' name='imageUrl' type='text' placeholder='Вставьте ссылку' value={value} onChange={(val)=>{setValue(val)}}/>
    <p className='text-neutral-600 dark:text-neutral-400 text-sm font-medium text-center'>Изображения можно вставить по прямой ссылке на изображение с Imgur.com <br/>https://i.imgur.com/xxxx.jpeg</p>
    <button onClick={()=>insertImage()} className='bg-orange-500 dark:bg-orange-600 py-1.25 rounded-md text-white font-medium transition-colors duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 cursor-pointer select-none'>Вставить</button>
  </div>
}