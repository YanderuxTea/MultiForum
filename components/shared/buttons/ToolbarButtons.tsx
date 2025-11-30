import {IToolbarButtonsData} from '@/data/toolbarButtonsData'
import {Editor} from '@tiptap/core'
import {motion} from 'framer-motion'
import {useEffect, useState} from 'react'

export default function ToolbarButtons({buttonData, editor}: {buttonData: IToolbarButtonsData, editor: Editor|null}) {
  const [activeMark, setActiveMark] = useState(false)
  useEffect(() => {
    if(!editor) return;
    function handler(){
      if(!editor) return;
      setActiveMark(editor.isActive(buttonData.mark??false))
    }
    editor.on('transaction', handler)
    return () => {editor.off('transaction', handler)}
  }, [editor])
  return <motion.button layout whileHover={{width:36, height:36}} className={` w-8 h-8 transition-all duration-300 ease-out select-none aspect-square flex items-center justify-center border rounded-md cursor-pointer ${activeMark&&buttonData.mark&&'border-orange-500 dark:border-orange-600 shadow-sm shadow-orange-500 dark:shadow-orange-600'}`} onClick={()=>buttonData.command?buttonData.command(editor):undefined}>
    {buttonData.icon}
  </motion.button>
}