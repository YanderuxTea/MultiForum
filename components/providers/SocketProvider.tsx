"use client";

import { io, Socket } from "socket.io-client";
import React, { ReactNode, useEffect, useRef } from "react";
import { SocketContext } from "@/context/SocketContext";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
  autoConnect: false,
});
export default function SocketProvider({ children }: { children: ReactNode }) {
  const [onlineList, setOnlineList] = React.useState<IOnlineList[]>([]);
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const loginChat = searchParams.get("login");
  const chatIdConst = useRef<string>("");
  const loginChatConst = useRef<string>("");
  const pathname = usePathname().replace("/", "");
  const router = useRouter();
  const isConnect = useRef<boolean>(false);

  useEffect(() => {
    function connectToChat() {
      if (!loginChat || !chatId || isConnect.current) return;
      socket.emit("connectToChat", { chatId, loginChat });
      loginChatConst.current = loginChat;
      chatIdConst.current = chatId;
      isConnect.current = true;
    }
    function disconnectFromChat() {
      socket.emit("disconnectFromChat", {
        chatId: chatIdConst.current,
        loginChat: loginChatConst.current,
      });
      loginChatConst.current = "";
      chatIdConst.current = "";
      isConnect.current = false;
    }
    if (pathname === "messenger") {
      if (chatId && loginChat) {
        if (
          loginChatConst.current.length > 0 &&
          chatIdConst.current.length > 0
        ) {
          disconnectFromChat();
        }
        socket.on("reconnect", () => {
          isConnect.current = false;
          connectToChat();
        });

        connectToChat();
      } else if (!chatId || !loginChat) {
        if (
          loginChatConst.current.length > 0 &&
          chatIdConst.current.length > 0
        ) {
          disconnectFromChat();
          socket.off("reconnect");
        }
      }
    } else {
      if (chatIdConst.current.length > 0 && loginChatConst.current.length > 0) {
        socket.off("reconnect");
        disconnectFromChat();
      }
    }
    return () => {
      if (loginChatConst.current.length > 0 && chatIdConst.current.length > 0) {
        socket.off("reconnect");
      }
    };
  }, [chatId, loginChat, pathname]);
  useEffect(() => {
    async function initSocket() {
      const req = await fetch("/api/getToken", {
        method: "GET",
      });
      const res = await req.json();
      if (res.token) {
        socket.auth = { token: res.token };
      }
      socket.connect();
    }
    initSocket();
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
    socket.on("newChat", (res) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("chatId", res.id);
      router.replace(`?${params.toString()}&login=${loginChatConst.current}`);
    });

    return () => {
      socket.disconnect();
      socket.off("init_user_list");
      socket.off("new_user_connect");
      socket.off("user_disconnect");
      socket.off("newChat");
      socket.off("newMessage");
    };
  }, [router, searchParams]);
  const value = {
    socket: socket,
    onlineList: onlineList,
  };
  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}
