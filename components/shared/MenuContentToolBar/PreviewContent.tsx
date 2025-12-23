import {Editor} from '@tiptap/core'
import {EditorContent, ReactNodeViewRenderer, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Color, FontSize, TextStyle} from '@tiptap/extension-text-style'
import {CharacterCount} from '@tiptap/extensions'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeBlockWrapper from '@/components/shared/CodeBlockWrapper'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import {all, createLowlight} from 'lowlight'

export default function PreviewContent({editor}:{editor:Editor|null}) {
  const lowlight = createLowlight(all)
  const viewer = useEditor({
    editable:false,
    content:editor?.getJSON(),
    extensions:[
        StarterKit.configure({
          codeBlock:false,
          link:{
            autolink:true,
            linkOnPaste:true,
            openOnClick:true
          }
        }),
        Color,
        FontSize,
        CharacterCount.configure({
          limit:6000
        }),
        CodeBlockLowlight.extend({
          addNodeView(){
            return ReactNodeViewRenderer(CodeBlockWrapper)
          }
        }).configure({lowlight}),
        Image,
        Youtube.configure({
          controls:true,
          nocookie:false,
          modestBranding:true,
          HTMLAttributes:{
            class:'rounded-xl w-full aspect-video'
          }
        }),
        TextStyle
        ],
    immediatelyRender:false
  })
  return <div className='mt-2.5 flex flex-col gap-2.5'>
    <p className='text-xl font-bold text-neutral-900 dark:text-neutral-100 text-center'>Предпросмотр</p>
    <EditorContent editor={viewer}/>
  </div>
}