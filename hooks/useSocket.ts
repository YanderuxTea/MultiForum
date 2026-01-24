"use client";

import { SocketContext } from "@/context/SocketContext";
import React from "react";

export default function useSocket() {
  const context = React.useContext(SocketContext);
  if (!context) throw Error("Компонент не обернут в провайдер сокета");
  return context;
}
