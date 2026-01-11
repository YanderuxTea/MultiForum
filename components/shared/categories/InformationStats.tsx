export default function InformationStats({
  themesCount,
  messageCount,
}: {
  themesCount: number;
  messageCount: number;
}) {
  return (
    <div className="flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700 text-sm">
      <div className="p-2.5">
        <p className="text-left font-medium text-neutral-900 dark:text-neutral-100 flex flex-row justify-between break-all items-center">
          Всего тем:{" "}
          <span className="text-neutral-700 dark:text-neutral-300 max-w-1/2">
            {themesCount.toLocaleString("en-US")}
          </span>
        </p>
      </div>
      <div className="p-2.5">
        <p className="text-left font-medium text-neutral-900 dark:text-neutral-100 flex flex-row justify-between break-all items-center">
          Всего сообщений:{" "}
          <span className="text-neutral-700 dark:text-neutral-300 max-w-1/2">
            {messageCount.toLocaleString("en-US")}
          </span>
        </p>
      </div>
    </div>
  );
}
