import useHeader from '@/hooks/useHeader'

export default function Menu() {
  const {isOpenMenu} = useHeader()
  return <svg width="24" height="24" viewBox="0 0 24 24" className='fill-none' xmlns="http://www.w3.org/2000/svg">
    <path d="M3 12H21" className='stroke-2 stroke-gray-700' style={{strokeLinejoin:'round', strokeLinecap:'round'}} />
    <path d="M3 6H21"  className={`stroke-2 stroke-gray-700 transition-transform duration-300 ease-out ${isOpenMenu&&'translate-y-1.5'}`} style={{strokeLinejoin:'round', strokeLinecap:'round'}} />
    <path d="M3 18H21" className={`stroke-2 stroke-gray-700 transition-transform duration-300 ease-out ${isOpenMenu&&'-translate-y-1.5'}`} style={{strokeLinejoin:'round', strokeLinecap:'round'}} />
  </svg>

}