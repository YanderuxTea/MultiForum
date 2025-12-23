import {Editor} from '@tiptap/core'
import {toolbarButtonsData} from '@/data/toolbarButtonsData'
import ToolbarButtons from '@/components/shared/buttons/ToolbarButtons'

export default function InputToolbar({editor, pending}: {editor: Editor|null, pending: boolean}) {
  return <div className='flex flex-row gap-2.5 inset-0 p-2.5 overflow-y-clip overflow-x-auto border-t border-x border-neutral-300 dark:border-neutral-700 rounded-md'>
    {toolbarButtonsData.map((buttonData)=>{
      return <ToolbarButtons pending={pending} key={buttonData.type} buttonData={buttonData} editor={editor}/>
    })}
  </div>
}