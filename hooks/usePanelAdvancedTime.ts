import { useContext } from "react";
import { ContextPanelAdvancedTime } from "@/context/ContextPanelAdvancedTime.ts";

export default function usePanelAdvancedTime() {
  const context = useContext(ContextPanelAdvancedTime);
  if (!context) {
    throw new Error("usePanelAdvancedTime context");
  }
  return context;
}
