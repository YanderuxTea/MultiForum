export default function BlockInformationUser({
  countMessage,
  countWarns,
  countBans,
}: {
  countMessage: number;
  countWarns: number;
  countBans: number;
}) {
  return (
    <div className="bg-white p-2.5 dark:bg-[#212121] rounded-md border border-neutral-300 dark:border-neutral-700 flex flex-col max-w-300 mx-auto w-full gap-2.5 lg:col-start-1 lg:row-start-2 max-h-max">
      <p className="text-lg font-bold text-neutral-700 dark:text-neutral-200">
        Общая информация
      </p>
      <p className="font-medium text-neutral-600 dark:text-neutral-400">
        Сообщений: {countMessage}
      </p>
      <p className="font-medium text-neutral-600 dark:text-neutral-400">
        Количество активных предупреждений: {countWarns % 3}/3
      </p>
      <p className="font-medium text-neutral-600 dark:text-neutral-400">
        Количество всех предупреждений: {countWarns}
      </p>
      <p className="font-medium text-neutral-600 dark:text-neutral-400">
        Количество блокировок: {countBans}
      </p>
    </div>
  );
}
