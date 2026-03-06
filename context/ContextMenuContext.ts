"use client";
import { createContext, createRef, RefObject } from "react";

export interface IContextMenuContext {
  setChatIdState: (chatIdState: string | null) => void;
  setPosition: (position: { x: number; y: number }) => void;
  setLoginChatState: (loginChatState: string | null) => void;
  chatIdState: string | null;
  loginChatState: string | null;
  setOpenedContextMenu: (openedContextMenu: boolean) => void;
  position: { x: number; y: number };
  openedContextMenu: boolean;
  messengerPageRefContainer: RefObject<HTMLDivElement | null>;
  deleteChatFunction: () => void;
  isDrag: boolean;
  setIsDrag: (isDrag: boolean) => void;
}
const initialData = {
  setChatIdState: () => {},
  setPosition: () => {},
  setLoginChatState: () => {},
  chatIdState: null,
  loginChatState: null,
  setOpenedContextMenu: () => {},
  position: { x: 0, y: 0 },
  openedContextMenu: false,
  messengerPageRefContainer: createRef<null>(),
  deleteChatFunction: () => {},
  isDrag: false,
  setIsDrag: () => {},
};

export const ContextMenuContext =
  createContext<IContextMenuContext>(initialData);
