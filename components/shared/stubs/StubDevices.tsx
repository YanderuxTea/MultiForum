export default function StubDevices() {
  return <div className='my-1.25 flex flex-row gap-2.5 items-center dark:bg-[#282828] bg-neutral-50 p-1.25 rounded-md border border-neutral-300 dark:border-neutral-700'>
    <div className='grow-0'>
      <div className='bg-neutral-700/25 dark:bg-white/10 w-10 aspect-square rounded-full animate-pulse'></div>
    </div>
    <div className='flex flex-col gap-2.5 grow'>
      <div className='bg-neutral-700/25 dark:bg-white/10 rounded-md h-4 animate-pulse'></div>
      <div className='bg-neutral-700/25 dark:bg-white/10 rounded-md h-2 animate-pulse'></div>
    </div>
  </div>
}