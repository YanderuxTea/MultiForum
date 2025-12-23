import {RefObject} from 'react'
import {Editor, JSONContent} from '@tiptap/core'
import {IMessage} from '@/context/CategoriesContext'

export default function BlockquoteButton({refEditor, pending, props, convertedDate}:{refEditor:RefObject<Editor|null>, pending: boolean, props:IMessage, convertedDate:string}) {
  return <button className='cursor-pointer text-neutral-600 dark:text-neutral-400 font-medium max-w-max' onClick={pending?undefined:()=> {
    if(refEditor.current){
      refEditor.current.chain().focus().insertContent({
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: props.Users.login,
                marks: [
                  {
                    type: 'link',
                    attrs: {
                      href: `/profile/${props.Users.login}`
                    }
                  }
                ]
              },
              {
                type: 'text',
                text: ` ${convertedDate}`
              }
            ]
          },
          ...props.text.content as JSONContent[]
        ]
      }).insertContent({type:'paragraph'}).toggleBlockquote().run()
    }
  }
  }>Цитировать</button>
}