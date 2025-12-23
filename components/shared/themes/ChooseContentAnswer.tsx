import React, {RefObject} from 'react'
import useDataUser from '@/hooks/useDataUser'
import NotAuthUser from '@/components/shared/themes/NotAuthUser'
import NotVerifyUser from '@/components/shared/themes/NotVerifyUser'
import {IMessage} from '@/context/CategoriesContext'
import InputAnswer from '@/components/shared/themes/InputAnswer'
import LockedTheme from '@/components/shared/themes/LockedTheme'
import {Editor} from '@tiptap/core'

export default function ChooseContentAnswer({messages, pageNumber, editorRef, pending, setPending, setMessages, setPageNumber, change}:{messages:IMessage[], pageNumber:number|null, editorRef:RefObject<Editor|null>, pending:boolean, setPending:React.TransitionStartFunction, setMessages:React.Dispatch<React.SetStateAction<IMessage[]|undefined>>, setPageNumber:React.Dispatch<React.SetStateAction<number|null>>, change:boolean}) {
  const userData = useDataUser()
  const locked = messages.length>0&&messages[0].Posts.locked
  if(change) return null
  if(!userData||userData.verifyAdm === 'No')
  {
    return <div className='w-full border border-neutral-300 dark:border-neutral-700 p-10 rounded-md bg-white dark:bg-[#212121] text-center'>
      {!userData&&<NotAuthUser/>}
      {userData?.verifyAdm === 'No' &&<NotVerifyUser/>}
    </div>
  }else if(userData&&userData.verifyAdm === 'Yes' && !locked) {
    if(typeof pageNumber === 'number'){
      return <InputAnswer editorRef={editorRef} pending={pending} setPending={setPending} setMessages={setMessages} setPageNumber={setPageNumber as React.Dispatch<React.SetStateAction<number>>}/>
    }
  }else if(locked) {
    return <LockedTheme/>
  }
}