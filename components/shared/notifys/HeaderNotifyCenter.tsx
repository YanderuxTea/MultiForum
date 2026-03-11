import useSocket from "@/hooks/useSocket.ts";
import useNotify from "@/hooks/useNotify.ts";

export default function HeaderNotifyCenter() {
  const { socket } = useSocket();
  const { setIsNotify, setMessage, notifications } = useNotify();
  function clearNotifyCenter() {
    if (!socket.connected) {
      setMessage("Ошибка: сервер недоступен");
      setIsNotify(true);
      return;
    }
    if (notifications.length === 0) {
      setMessage("Ошибка: список уведомлений пуст");
      setIsNotify(true);
      return;
    }
    socket.emit("clearNotifyCenter");
  }
  return (
    <div
      className={
        "flex flex-row justify-between p-2.5 border-b border-neutral-300 dark:border-neutral-700"
      }
    >
      <p
        className={
          "text-lg font-semibold text-neutral-800 dark:text-neutral-200"
        }
      >
        Центр уведомлений
      </p>
      <button
        onClick={() => {
          clearNotifyCenter();
        }}
        className={
          "text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-pointer transition-colors duration-300" +
          " ease-out hover:text-neutral-900 dark:hover:text-neutral-200"
        }
      >
        Очистить все
      </button>
    </div>
  );
}
