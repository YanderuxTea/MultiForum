import {IToolbarButtonsData} from '@/data/toolbarButtonsData'
import {Editor} from '@tiptap/core'
import {AnimatePresence, motion} from 'framer-motion'
import {useEffect, useState} from 'react'
import useDataUser from '@/hooks/useDataUser'
import OpenMenuAdminsPanelProvider from '@/components/providers/OpenMenuAdminsPanelProvider'
import MenuWindow from '@/components/ui/menus/MenuWindow'

export default function ToolbarButtons({buttonData, editor, pending}: {buttonData: IToolbarButtonsData, editor: Editor|null, pending: boolean}) {
  const [activeMark, setActiveMark] = useState(false)
  const [openMenu, setOpenMenu] = useState(false)
  const userData = useDataUser()
  useEffect(() => {
    if(!editor) return;
    function handler(){
      if(!editor) return;
      setActiveMark(editor.isActive(buttonData.mark??false))
    }
    editor.on('transaction', handler)
    return () => {editor.off('transaction', handler)}
  }, [editor])
  if(!userData) return null
  if(buttonData.type.includes('admins') && userData.role === 'User') {
    return null
  }
  return <OpenMenuAdminsPanelProvider>
    <AnimatePresence>
      {buttonData.menuContent&&openMenu&&<MenuWindow props={{setIsOpenMenu:setOpenMenu, isOpenMenu:openMenu, content:buttonData.menuContent(editor, setOpenMenu)}}/>}
    </AnimatePresence>
    <motion.button disabled={pending} layout whileHover={{width:36, height:36}} className={`disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 w-8 h-8 transition-all duration-300 ease-out select-none aspect-square flex items-center justify-center border rounded-md cursor-pointer ${activeMark&&buttonData.mark&&'border-orange-500 dark:border-orange-600 shadow-sm shadow-orange-500 dark:shadow-orange-600'}`} onClick={pending?undefined:()=>buttonData.command?buttonData.command(editor):buttonData.menuContent?setOpenMenu(true):undefined}>
      {buttonData.icon}
    </motion.button>
  </OpenMenuAdminsPanelProvider>

}