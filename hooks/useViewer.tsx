import {all, createLowlight} from 'lowlight'
import {ReactNodeViewRenderer, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Color, FontSize, TextStyle} from '@tiptap/extension-text-style'
import {CharacterCount} from '@tiptap/extensions'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeBlockWrapper from '@/components/shared/CodeBlockWrapper'
import Youtube from '@tiptap/extension-youtube'
import {JSONContent} from '@tiptap/core'
import Image from '@tiptap/extension-image'

export default function useViewer({text}:{text:JSONContent}) {
  const lowlight = createLowlight(all)
  return useEditor({
    editable:false,
    content:text,
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
}