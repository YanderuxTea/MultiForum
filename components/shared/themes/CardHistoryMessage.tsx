import {IHistory} from '@/context/CategoriesContext'
import useViewer from '@/hooks/useViewer'
import {EditorContent} from '@tiptap/react'

export default function CardHistoryMessage(props:{props:IHistory}) {
  const viewerBefore = useViewer({text:props.props.beforeText})
  const viewerAfter = useViewer({text:props.props.afterText})
  return <div className='p-2.5 border border-neutral-300 dark:border-neutral-700 rounded-md flex flex-col gap-5'>
    <p className='font-medium text-sm text-neutral-800 dark:text-neutral-200'>Изменение: {Intl.DateTimeFormat('ru-RU',{day:'numeric', month:'short', year:'numeric', hour:'numeric', minute:'numeric'}).format(new Date(props.props.updateAt)).replace('г.','')}</p>
    <div className='flex flex-col gap-2.5'>
      <div className=' flex flex-col'>
        <p className='font-medium text-neutral-900 dark:text-neutral-100'>До изменений:</p>
        <EditorContent editor={viewerBefore} className='bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded-md border border-neutral-300 dark:border-neutral-700'/>
      </div>
      <div className=' flex flex-col'>
        <p className='font-medium text-neutral-900 dark:text-neutral-100'>После изменений:</p>
        <EditorContent editor={viewerAfter} className='bg-neutral-100 dark:bg-neutral-800 p-2.5 rounded-md border border-neutral-300 dark:border-neutral-700'/>
      </div>
    </div>
  </div>
}