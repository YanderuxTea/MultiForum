import {ISubCategories} from '@/context/CategoriesContext'
import useCheckIconSubCategory from '@/hooks/useCheckIconSubCategory'
import Link from 'next/link'

export default function SubCategoriesCard({props}:{props:ISubCategories}) {
  console.log(props)
  const icon = useCheckIconSubCategory({props:props})
  return <div className='flex flex-row items-center p-2.5 gap-5'>
    <div className='bg-orange-500 dark:bg-orange-600 opacity-40 p-1.25 rounded-full'>
      {icon}
    </div>
    <div>
      <div className='flex flex-col'>
        <Link href={`/subCategories/${props.title}?subCategory=${props.id}`} className='transition-colors duration-300 ease-out max-w-max hover:text-blue-500 dark:hover:text-blue-600 text-lg text-neutral-900 dark:text-neutral-100 font-medium'>{props.title}</Link>
        <p className='text-sm text-neutral-700 dark:text-neutral-300'>{props._count.posts} сообщений</p>
      </div>
    </div>
    <div>
      {props._count.posts>0? null : null}
    </div>
  </div>
}