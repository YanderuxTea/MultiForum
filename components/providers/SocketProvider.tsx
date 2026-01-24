"use client";

import { io, Socket } from "socket.io-client";
import React, { ReactNode, useEffect } from "react";
import { SocketContext } from "@/context/SocketContext";
export interface IOnlineList {
  sId: string;
  id: string;
  login: string;
  role: string;
}
export interface ISocketProvider {
  socket: Socket;
  onlineList: IOnlineList[];
}
const socket = io(process.env.NEXT_PUBLIC_NODE_SERVER_URL, {
  withCredentials: true,
  autoConnect: false,
});
export default function SocketProvider({ children }: { children: ReactNode }) {
  const [onlineList, setOnlineList] = React.useState<IOnlineList[]>([]);
  useEffect(() => {
    socket.connect();
    socket.on("init_user_list", (res) => {
      setOnlineList(res);
    });
    socket.on("new_user_connect", (res) => {
      setOnlineList((prev) => {
        const isExist = prev.some((user) => user.id === res.id);
        if (isExist) {
          return prev.map((val) => (val.id === res.id ? res : val));
        }
        return [...prev, res];
      });
    });
    socket.on("user_disconnect", (res) => {
      setOnlineList((prev) => prev.filter((val) => val.id !== res));
    });
    return () => {
      socket.disconnect();
      socket.off("init_user_list");
      socket.off("new_user_connect");
      socket.off("user_disconnect");
    };
  }, []);
  const value = {
    socket: socket,
    onlineList: onlineList,
  };
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
