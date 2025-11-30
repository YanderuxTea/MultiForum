'use client'
import {EditorContent, ReactNodeViewRenderer, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {FontSize} from '@tiptap/extension-text-style'
import InputToolbar from '@/components/shared/InputToolbar'
import {CharacterCount, Placeholder} from '@tiptap/extensions'
import {useEffect, useState} from 'react'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import {all, createLowlight} from 'lowlight'
import CodeBlockWrapper from '@/components/shared/CodeBlockWrapper'

export default function InputArea() {
  const draft = localStorage.getItem('draft') ?? ''
  const [value, setValue] = useState(localStorage.getItem('draft')?JSON.parse(draft):'')
  const lowlight = createLowlight(all)
  const editor = useEditor({
    extensions:[
      StarterKit.configure({
        codeBlock:false
      }),
      FontSize,
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: 'Начните вводить свой текст...'
      }),
      CharacterCount.configure({
        limit:6000
      }),
      CodeBlockLowlight.extend({
        addNodeView(){
          return ReactNodeViewRenderer(CodeBlockWrapper)
        }
      }).configure({lowlight})
    ],
    content:value,
    editorProps: {
      attributes:{
        class:'border outline-none p-2.5 grow rounded-md border-neutral-300 dark:border-neutral-700 transition-colors duration-300 ease-out focus:border-neutral-400 dark:focus:border-neutral-600'
      }
    },
    onUpdate: ({editor})=>{
      setValue(JSON.stringify(editor.getJSON()))
    },
    immediatelyRender:false
  })
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
      <InputToolbar editor={editor}/>
      <EditorContent editor={editor} className='grow flex'/>
    </div>
    <button className='bg-sky-500 dark:bg-sky-600 py-1.25 max-w-max px-2.5 text-white font-medium rounded-md cursor-pointer hover:bg-sky-400 dark:hover:bg-sky-500 active:bg-sky-600 dark:active:bg-sky-700 transition-colors duration-300 ease-out'>Отправить</button>
  </div>
}