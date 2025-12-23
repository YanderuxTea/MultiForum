import {ReactNodeViewRenderer, useEditor} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import {Color, FontSize, TextStyle} from '@tiptap/extension-text-style'
import {CharacterCount, Placeholder} from '@tiptap/extensions'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import CodeBlockWrapper from '@/components/shared/CodeBlockWrapper'
import {all, createLowlight} from 'lowlight'
import Youtube from '@tiptap/extension-youtube'
import Image from '@tiptap/extension-image'
import React from 'react'
import {JSONContent} from '@tiptap/core'

export default function useEditorHook({value, setValue}:{value: JSONContent|string, setValue: React.Dispatch<React.SetStateAction<JSONContent|string>>}) {
  const lowlight = createLowlight(all)
  return useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        link: {
          autolink: true,
          linkOnPaste: true,
          openOnClick: true
        }
      }),
      Color,
      FontSize,
      Placeholder.configure({
        emptyEditorClass: 'is-editor-empty',
        placeholder: 'Начните вводить свой текст...'
      }),
      CharacterCount.configure({
        limit: 6000
      }),
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockWrapper)
        }
      }).configure({lowlight}),
      Image,
      Youtube.configure({
        controls: true,
        nocookie: false,
        modestBranding: true,
        HTMLAttributes: {
          class: 'rounded-xl w-full aspect-video'
        }
      }),
      TextStyle,
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'border outline-none p-2.5 grow rounded-md border-neutral-300 dark:border-neutral-700 transition-colors duration-300 ease-out focus:border-neutral-400 dark:focus:border-neutral-600'
      }
    },
    onUpdate: ({editor}) => {
      setValue(editor.getJSON())
    },
    immediatelyRender: false
  })
}