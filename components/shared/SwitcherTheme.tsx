
import {useTheme} from 'next-themes'
import Sun from '@/components/shared/icons/Sun'
import Monitor from '@/components/shared/icons/Monitor'
import Moon from '@/components/shared/icons/Moon'
import {JSX, useEffect, useState} from 'react'
import {motion} from 'framer-motion'
interface ISwitcherThemeButton {
  theme: string,
  icon: JSX.Element
}
export default function SwitcherTheme() {
  const {setTheme, theme} = useTheme();
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const arrButton: ISwitcherThemeButton[] = [
    {
      theme: 'system',
      icon: <Monitor/>
    },
    {
      theme: 'light',
      icon: <Sun/>
    },
    {
      theme: 'dark',
      icon: <Moon/>
    }
  ]
  useEffect(() => {
    arrButton.map((button,index)=>{
      if(button.theme === theme){
        setSelectedIndex(index)
      }
    })
  }, [theme])
  return <div className='flex flex-row gap-2.5 w-max p-0.5 rounded-full bg-gray-100 dark:bg-[#282828]'>
    {arrButton.map((item, index) => {return <button className='relative w-9 aspect-square items-center justify-center flex cursor-pointer' key={item.theme} onClick={()=> setTheme(item.theme)}>{item.icon}{index === selectedIndex ? (<motion.div layoutId='backgroundButtonSwitcher' className='absolute inset-0 bg-white dark:bg-[#505050] rounded-full border border-gray-700/25 '></motion.div>):null}</button>})}
  </div>
}