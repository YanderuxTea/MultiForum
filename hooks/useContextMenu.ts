"use client";
import { useContext } from "react";
import { ContextMenuContext } from "@/context/ContextMenuContext.ts";

export default function useContextMenu() {
  const context = useContext(ContextMenuContext);
  if (!context) {
    throw new Error("useContextMenu must be used within the context!");
  }
  return context;
}
