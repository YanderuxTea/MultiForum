import NotificationsIcon from "@/components/shared/icons/NotificationsIcon.tsx";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useNotify from "@/hooks/useNotify.ts";
import useSocket from "@/hooks/useSocket.ts";
import { refreshNotifications } from "@/components/ui/headers/actions.ts";

export default function NotificationsButton({
  setOpenMenuAuth,
  setIsOpenNotifyCenter,
  countNotify,
  isOpenNotifyCenter,
}: {
  isOpenNotifyCenter: boolean;
  countNotify: number;
  setIsOpenNotifyCenter: Dispatch<SetStateAction<boolean>>;
  setOpenMenuAuth?: (value: boolean) => void;
}) {
  const {
    newNotify,
    setNewNotify,
    setCountNotifications,
    setIsNotify,
    setMessage,
    setNotifications,
  } = useNotify();
  const { socket } = useSocket();
  const [countNotifyState, setCountNotifyState] = useState<number>(countNotify);
  useEffect(() => {
    setCountNotifications((prevState) => prevState + 1);
    if (isOpenNotifyCenter) {
      setNewNotify(0);
    }
  }, [newNotify, isOpenNotifyCenter]);
  useEffect(() => {
    socket.on("openNotifyCenterRes", () => {
      setCountNotifications(countNotifyState);
      setCountNotifyState(0);
      setNewNotify(0);
    });
    socket.on("clearedNotifyCenter", async (data) => {
      await refreshNotifications(data.login);
      setCountNotifyState(0);
      setNewNotify(0);
      setCountNotifications(0);
      setNotifications([]);
    });
    return () => {
      socket.off("openNotifyCenterRes");
      socket.off("clearedNotifyCenter");
    };
  }, [
    countNotifyState,
    setCountNotifications,
    setIsOpenNotifyCenter,
    setNewNotify,
    setNotifications,
    socket,
  ]);
  function clickButton() {
    if (!socket.connected) {
      setMessage("Ошибка: сервер недоступен");
      setIsNotify(true);
      return;
    }
    setIsOpenNotifyCenter((prev) => !prev);
    socket.emit("openNotifyCenter");
  }
  return (
    <button
      onMouseMove={setOpenMenuAuth ? () => setOpenMenuAuth(false) : undefined}
      onClick={() => clickButton()}
      className={"cursor-pointer max-h-max relative"}
    >
      {countNotifyState + newNotify > 0 && (
        <div
          className={
            "bg-red-500 -right-0.5 -top-0.5 absolute text-[10px] rounded-full w-4 aspect-square text-white"
          }
        >
          {countNotifyState + newNotify}
        </div>
      )}
      <NotificationsIcon />
    </button>
  );
}
