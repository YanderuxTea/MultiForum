"use client";
import { createContext } from "react";

export interface IContextPanelAdvancedTime {
  isOpenPanel: boolean;
  setIsOpenPanel: (value: boolean) => void;
  convertedDate: string;
  setConvertedDate: (value: string) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  setIsAuthor: (isAuthor: boolean) => void;
  isAuthor: boolean;
}
const value: IContextPanelAdvancedTime = {
  setIsAuthor: () => {},
  isAuthor: false,
  isOpenPanel: false,
  setIsOpenPanel: () => {},
  convertedDate: "",
  setConvertedDate: () => {},
  position: { x: 0, y: 0 },
  setPosition: () => {},
};
export const ContextPanelAdvancedTime =
  createContext<IContextPanelAdvancedTime>(value);
