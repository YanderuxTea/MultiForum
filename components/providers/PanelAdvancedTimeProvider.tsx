"use client";
import { ReactNode, useState } from "react";
import {
  ContextPanelAdvancedTime,
  IContextPanelAdvancedTime,
} from "@/context/ContextPanelAdvancedTime.ts";

export default function PanelAdvancedTimeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [convertedDate, setConvertedDate] = useState<string>("");
  const [isOpenPanel, setIsOpenPanel] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isAuthor, setIsAuthor] = useState<boolean>(false);
  const value: IContextPanelAdvancedTime = {
    setConvertedDate: setConvertedDate,
    setIsOpenPanel: setIsOpenPanel,
    isOpenPanel: isOpenPanel,
    convertedDate: convertedDate,
    position: position,
    setPosition: setPosition,
    setIsAuthor: setIsAuthor,
    isAuthor: isAuthor,
  };
  return (
    <ContextPanelAdvancedTime.Provider value={value}>
      {children}
    </ContextPanelAdvancedTime.Provider>
  );
}
