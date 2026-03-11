"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { NotifyContext } from "@/context/NotifyContext";
import useSocket from "@/hooks/useSocket.ts";
import { refreshNotifications } from "@/components/ui/headers/actions.ts";
import { JsonValue } from "@prisma/client/runtime/client";

export interface INotification {
  loginRecipient: string;
  idNotify: string;
  createdAt: Date;
  typeNotify: string;
  metaData: JsonValue;
}
export default function NotifyProvider({ children }: { children: ReactNode }) {
  const [isNotify, setIsNotify] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [newNotify, setNewNotify] = useState<number>(0);
  const [countNotifications, setCountNotifications] = useState<number>(0);
  const value = {
    isNotify: isNotify,
    setIsNotify: setIsNotify,
    message: message,
    setMessage: setMessage,
    newNotify: newNotify,
    notifications: notifications,
    setNotifications: setNotifications,
    setNewNotify: setNewNotify,
    countNotifications: countNotifications,
    setCountNotifications: setCountNotifications,
  };

  const { socket } = useSocket();

  useEffect(() => {
    socket.on("newMessageNotify", async (data: INotification) => {
      await refreshNotifications(data.loginRecipient);
      setNewNotify((prevState) => prevState + 1);
      setNotifications((prevState) => [data, ...prevState]);
    });

    socket.on("yourThemeClose", async (data: INotification) => {
      await refreshNotifications(data.loginRecipient);
      setNewNotify((prevState) => prevState + 1);
      setNotifications((prevState) => [data, ...prevState]);
    });
    socket.on("answerInYourTheme", async (data: INotification) => {
      await refreshNotifications(data.loginRecipient);
      setNewNotify((prevState) => prevState + 1);
      setNotifications((prevState) => [data, ...prevState]);
    });
    socket.on("messageReacted", async (data: INotification) => {
      await refreshNotifications(data.loginRecipient);
      setNewNotify((prevState) => prevState + 1);
      setNotifications((prevState) => [data, ...prevState]);
    });
    socket.on("upRank", async (data: INotification) => {
      await refreshNotifications(data.loginRecipient);
      setNewNotify((prevState) => prevState + 1);
      setNotifications((prevState) => [data, ...prevState]);
    });
    if (isNotify) {
      const timer = setTimeout(() => {
        setIsNotify(false);
      }, 4000);
      return () => clearTimeout(timer);
    }
    return () => {
      socket.off("newMessageNotify");
      socket.off("yourThemeClose");
      socket.off("answerInYourTheme");
      socket.off("messageReacted");
      socket.off("upRank");
    };
  }, [isNotify, socket]);
  return (
    <NotifyContext.Provider value={value}>{children}</NotifyContext.Provider>
  );
}
