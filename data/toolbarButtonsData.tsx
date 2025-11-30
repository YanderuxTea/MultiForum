import {JSX} from 'react'
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

export interface IToolbarButtonsData {
  type: string;
  icon: JSX.Element;
  mark?:string;
  command?: (editor: Editor|null) => void;
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
  },
  {
    type:'imageButton',
    icon: <ImageIcon/>
  },
  {
    type:'previewButton',
    icon: <PreviewIcon/>
  },
  {
    type:'adminsDeclineButton',
    icon: <AdminsDeclineIcon/>
  },
  {
    type:'adminsCloseButton',
    icon: <AdminsCloseIcon/>
  },
  {
    type:'adminsCheckButton',
    icon: <AdminsCheckIcon/>
  }
]