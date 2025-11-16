import {motion} from 'framer-motion'
import useCategories from '@/hooks/useCategories'
import CardsDeleteCategories from '@/components/shared/ManagementCategories/CardsDeleteCategories'
import React, {useState} from 'react'
import {ICategories} from '@/context/CategoriesContext'
import useNotify from '@/hooks/useNotify'

export default function DeleteCategoriesPanel({pending, setPending, setOpenMenu}:{pending:boolean, setPending:React.TransitionStartFunction, setOpenMenu: React.Dispatch<React.SetStateAction<boolean>>}) {
  const categories = useCategories()
  const [selectCategories, setSelectCategories] = useState<ICategories[]>([])
  const {setIsNotify, setMessage} = useNotify()
  const {setCategories} = useCategories()
  async function deleteCategories(){
    setPending(async ()=>{
      if (selectCategories.length === 0){
        setIsNotify(true)
        setMessage('Ошибка: вы не выбрали категории')
        return
      }else {
        const req = await fetch('/api/categories/delete',{
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({selectCategories})
        })
        const res = await req.json()
        if(res.ok){
          const idsToDelete = new Set(selectCategories.map(c => c.id))
          setCategories(prevState => prevState.filter((category)=> !idsToDelete.has(category.id)))
          setIsNotify(true)
          setMessage(res.message)
          setOpenMenu(false)
        }else {
          setIsNotify(true)
          setMessage(`Ошибка: ${res.message}`)
        }
      }
    })
  }
  return <motion.div layout className='flex flex-col gap-2.5'>
    <p className='text-neutral-800 dark:text-neutral-200 text-center'>{categories.categories.length>0?'Выберите категории для удаления':'Категорий нет'}</p>
    <div className='flex flex-col gap-2.5 max-h-50 overflow-y-auto'>
      {categories.categories.length===0? null : categories.categories.map((category) => {
        return <CardsDeleteCategories pending={pending} key={category.id} props={category} selectCategories={selectCategories} setSelectCategories={setSelectCategories}/>
      })}
    </div>
    <button disabled={pending} onClick={()=>deleteCategories()} className='bg-red-500 dark:bg-red-600 w-full rounded-md py-1.25 transition-colors duration-300 ease-out hover:bg-red-400 dark:hover:bg-red-500 active:bg-red-600 dark:active:bg-red-700 cursor-pointer text-white font-medium disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 select-none'>{pending?'Удаляем':'Удалить'}</button>
  </motion.div>
}