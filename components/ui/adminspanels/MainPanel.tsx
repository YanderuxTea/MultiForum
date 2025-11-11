export default function MainPanel() {
  return <div className='px-2.5 flex flex-col gap-1.25 bg-white dark:bg-[#212121] p-5 border border-neutral-300 dark:border-neutral-700 rounded-md w-full'>
    <h1 className='text-lg text-neutral-900 font-bold text-center text-balance dark:text-neutral-100'>Главная страница панели Администрирования</h1>
    <div className='flex justify-center w-full h-full items-center'>
      <p className='text-neutral-700 text-center text-balance dark:text-neutral-300'>
        Здесь ничего нет 😎
        <br/>
        Выбери раздел чтобы увидеть другие панели для взаимодействия с пользователями
      </p>
    </div>
  </div>
}