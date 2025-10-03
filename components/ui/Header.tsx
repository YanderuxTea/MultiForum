'use client'
import Logo from '@/components/shared/Logo'
import Menu from '@/components/shared/icons/Menu'
import useCurrentWidth from '@/hooks/useCurrentWidth'
import useHeader from '@/hooks/useHeader'

export default function Header() {
  const width = useCurrentWidth()
  const {setIsOpenMenu} = useHeader();
  return <header className='w-full flex items-center px-2.5 bg-white fixed z-10 justify-center'>
    <div className='max-w-300 w-full py-2.5 bg-white flex flex-row justify-between items-center'>
        <Logo/>
      {width<768&&<button onClick={()=>setIsOpenMenu(prevState => !prevState)}><Menu/></button>}
    </div>
  </header>
}