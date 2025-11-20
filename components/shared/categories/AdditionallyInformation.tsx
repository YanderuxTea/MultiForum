import {IAdditionalInformation} from '@/data/additionallyInformation'

export default function AdditionallyInformation({props}:{props:IAdditionalInformation}) {
  return <div className='flex flex-col bg-white dark:bg-[#212121] rounded-md border border-neutral-300 dark:border-neutral-700'>
    <div className='dark:bg-orange-600 text-neutral-900 dark:text-neutral-100 font-medium rounded-t-md px-2.5 py-1.25 border-b border-neutral-300 dark:border-neutral-700'>
      <p>{props.title}</p>
    </div>
    <div className='text-center text-neutral-600 dark:text-neutral-400'>
      <p className='py-2.5'>В разработке</p>
    </div>
  </div>
}