"use client";
import {
  ContextMenuContext,
  IContextMenuContext,
} from "@/context/ContextMenuContext.ts";
import { ReactNode, useEffect, useRef, useState } from "react";
import useCurrentWidth from "@/hooks/useCurrentWidth.tsx";
import useSocket from "@/hooks/useSocket.ts";
import useNotify from "@/hooks/useNotify.ts";

export default function ContextMenuProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [openedContextMenu, setOpenedContextMenu] = useState<boolean>(false);
  const [chatIdState, setChatIdState] = useState<string | null>(null);
  const [loginChatState, setLoginChatState] = useState<string | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const messengerPageRefContainer = useRef<HTMLDivElement | null>(null);
  const width = useCurrentWidth();
  const [isDrag, setIsDrag] = useState<boolean>(false);
  useEffect(() => {
    setChatIdState(null);
    setLoginChatState(null);
    setOpenedContextMenu(false);
  }, [width]);
  const { socket } = useSocket();
  const { setMessage, setIsNotify } = useNotify();
  const [block, setBlock] = useState<boolean>(false);
  function deleteChat() {
    if (socket.connected && !block) {
      socket.emit("deleteChat", { id: chatIdState, login: loginChatState });
      setBlock(true);
    } else if (!socket.connected) {
      setMessage("Ошибка: сервер недоступен");
      setIsNotify(true);
    } else if (block) {
      setMessage("Ошибка: дождитесь удаления чата");
      setIsNotify(true);
    }
  }
  useEffect(() => {
    socket.on("errorDeletingChat", () => {
      setMessage("Ошибка: произошла ошибка удаления чата");
      setBlock(false);
    });
    socket.on("processExecution", () => {
      setMessage("Ошибка: дождитесь удаления чата");
      setBlock(true);
    });
    socket.on("successfulDeletingChat", () => {
      setBlock(false);
    });
    return () => {
      socket.off("errorDeletingChat");
      socket.off("processExecution");
      socket.off("successfulDeletingChat");
    };
  }, [setMessage, socket]);
  const data: IContextMenuContext = {
    messengerPageRefContainer,
    setChatIdState,
    setPosition,
    setLoginChatState,
    chatIdState,
    loginChatState,
    setOpenedContextMenu,
    position,
    openedContextMenu,
    deleteChatFunction: deleteChat,
    isDrag: isDrag,
    setIsDrag: setIsDrag,
  };
  return (
    <ContextMenuContext.Provider value={data}>
      {children}
    </ContextMenuContext.Provider>
  );
}
