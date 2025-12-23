import React, {JSX} from 'react'
import BoldIcon from '@/components/shared/icons/toolbar/BoldIcon'
import ItalicIcon from '@/components/shared/icons/toolbar/ItalicIcon'
import StrikeIcon from '@/components/shared/icons/toolbar/StrikeIcon'
import UnderlineIcon from '@/components/shared/icons/toolbar/UnderlineIcon'
import CodeBlockIcon from '@/components/shared/icons/toolbar/CodeBlockIcon'
import LinkIcon from '@/components/shared/icons/toolbar/LinkIcon'
import ImageIcon from '@/components/shared/icons/toolbar/ImageIcon'
import PreviewIcon from '@/components/shared/icons/toolbar/PreviewIcon'
import AdminsDeclineIcon from '@/components/shared/icons/toolbar/AdminsDeclineIcon'
import AdminsCloseIcon from '@/components/shared/icons/toolbar/AdminsCloseIcon'
import AdminsCheckIcon from '@/components/shared/icons/toolbar/AdminsCheckIcon'
import {Editor} from '@tiptap/core'
import YouTubeIcon from '@/components/shared/icons/toolbar/YouTubeIcon'
import LinkContent from '@/components/shared/MenuContentToolBar/LinkContent'
import ImageContent from '@/components/shared/MenuContentToolBar/ImageContent'
import VideoContent from '@/components/shared/MenuContentToolBar/VideoContent'
import PreviewContent from '@/components/shared/MenuContentToolBar/PreviewContent'

export interface IToolbarButtonsData {
  type: string;
  icon: JSX.Element;
  mark?:string;
  command?: (editor: Editor|null) => void;
  menuContent?: (editor:Editor|null, setIsOpenMenu:React.Dispatch<React.SetStateAction<boolean>>)=>JSX.Element;
}
export const toolbarButtonsData: IToolbarButtonsData[] =[
  {
    type:'boldButton',
    icon: <BoldIcon/>,
    mark:'bold',
    command: editor => editor?.chain().focus().toggleBold().run(),
  },
  {
    type:'italicButton',
    icon: <ItalicIcon/>,
    mark:'italic',
    command: editor => editor?.chain().focus().toggleItalic().run(),
  },
  {
    type:'strikeButton',
    icon: <StrikeIcon/>,
    mark:'strike',
    command: editor => editor?.chain().focus().toggleStrike().run(),
  },
  {
    type:'underlineButton',
    icon: <UnderlineIcon/>,
    mark:'underline',
    command: editor => editor?.chain().focus().toggleUnderline().run(),
  },
  {
    type:'codeBlockButton',
    icon: <CodeBlockIcon/>,
    mark:'codeBlock',
    command: editor => editor?.chain().focus().toggleCodeBlock().run(),
  },
  {
    type:'linkButton',
    icon: <LinkIcon/>,
    menuContent: (editor,setIsOpenMenu) => <LinkContent editor={editor} setIsOpenMenu={setIsOpenMenu}/>
  },
  {
    type:'imageButton',
    icon: <ImageIcon/>,
    menuContent: (editor,setIsOpenMenu) => <ImageContent editor={editor} setIsOpenMenu={setIsOpenMenu}/>
  },
  {
    type: 'videoButton',
    icon: <YouTubeIcon/>,
    menuContent: (editor,setIsOpenMenu) => <VideoContent editor={editor} setIsOpenMenu={setIsOpenMenu}/>
  },
  {
    type:'previewButton',
    icon: <PreviewIcon/>,
    menuContent: editor => <PreviewContent editor={editor}/>
  },
  {
    type:'adminsDeclineButton',
    icon: <AdminsDeclineIcon/>,
    command: editor => editor?.chain().focus().insertContent([
      {
        type:'text',
        text:'Отказ',
        marks:[
          {
            type:'textStyle',
            attrs:{
              color:'#FA0000',
              fontSize:'24px',
            },
          },
          {
            type:'bold'
          }
        ]
      },
      {
        type: 'paragraph',
      }
    ]).run()
  },
  {
    type:'adminsCloseButton',
    icon: <AdminsCloseIcon/>,
    command: editor => editor?.chain().focus().insertContent([
      {
        type:'text',
        text:'Закрыто',
        marks:[
          {
            type:'textStyle',
            attrs:{
              color:'#3B79FF',
              fontSize:'24px',
            },
          },
          {
            type:'bold'
          }
        ]
      },
      {
        type: 'paragraph',
      }
    ]).run()
  },
  {
    type:'adminsCheckButton',
    icon: <AdminsCheckIcon/>,
    command: editor => editor?.chain().focus().insertContent([
      {
        type:'text',
        text:'Меры приняты',
        marks:[
          {
            type:'textStyle',
            attrs:{
              color:'#00A946',
              fontSize:'24px',
            },
          },
          {
            type:'bold'
          }
        ]
      },
      {
        type: 'paragraph',
      }
    ]).run()
  }
]