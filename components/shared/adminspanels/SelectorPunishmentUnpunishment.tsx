import React from 'react'

export default function SelectorPunishmentUnpunishment({checked, setChecked}: {checked: string, setChecked: React.Dispatch<React.SetStateAction<string>>}) {
  return <div className='flex flex-row justify-between w-full text-neutral-800 dark:text-neutral-200 font-medium gap-1.25 border rounded-md border-neutral-300 dark:border-neutral-700 p-1.25 select-none'>
    <label htmlFor='unpunishment' className={`cursor-pointer w-full text-center transition-colors duration-300 ease-out rounded-md py-1.25  ${checked==='unpunishment'?'bg-orange-500 dark:bg-orange-600 text-neutral-100':'dark:text-neutral-300'}`}>
      <input type='radio' id='unpunishment' name='punishmentSelect' className='hidden' onChange={(e)=>setChecked(e.target.id)}/>
      Снять наказание
    </label>
    <label htmlFor='punishment' className={`cursor-pointer w-full text-center transition-colors duration-300 ease-out rounded-md py-1.25 ${checked==='punishment'?'bg-orange-500 dark:bg-orange-600 text-neutral-100':'dark:text-neutral-300'}`}>
      <input type='radio' id='punishment' name='punishmentSelect' className='hidden' onChange={(e)=>setChecked(e.target.id)}/>
      Наказать
    </label>
  </div>
}