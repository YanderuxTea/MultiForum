import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import useContextMenu from "@/hooks/useContextMenu.ts";
import TrashIcon from "@/components/shared/icons/TrashIcon.tsx";

export default function ContextMenu() {
  const {
    setOpenedContextMenu,
    position,
    messengerPageRefContainer,
    deleteChatFunction,
    setChatIdState,
    setLoginChatState,
    setIsDrag,
  } = useContextMenu();
  const contextMenuRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function closeContextMenu(e: Event) {
      if (!contextMenuRef.current?.contains(e.target as Node)) {
        setChatIdState(null);
        setLoginChatState(null);
        setOpenedContextMenu(false);
        setIsDrag(false);
      }
    }
    document.addEventListener("pointerdown", closeContextMenu);
    return () => {
      document.removeEventListener("pointerdown", closeContextMenu);
    };
  }, []);
  const rect = messengerPageRefContainer.current?.getBoundingClientRect();
  const top = rect?.top || 0;
  const left = rect?.left || 0;
  return (
    <motion.div
      initial={{ scaleX: 0, scaleY: 0 }}
      animate={{ scaleX: 1, scaleY: 1 }}
      exit={{ opacity: 0 }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      style={{
        x: position.x - left + 10,
        y: position.y - top,
      }}
      transition={{ duration: 0.15, type: "tween" }}
      className={
        "absolute text-sm bg-white border border-neutral-300 text-neutral-800 dark:bg-neutral-900" +
        " dark:border-none dark:text-neutral-200 rounded-lg z-101 -translate-y-1/2 origin-top-left" +
        " overflow-clip" +
        " min-h-0"
      }
      ref={contextMenuRef}
    >
      <button
        onClick={() => {
          deleteChatFunction();
          setChatIdState(null);
          setLoginChatState(null);
          setOpenedContextMenu(false);
          setIsDrag(false);
        }}
        className={
          "cursor-pointer flex flex-row gap-2.5 items-center  text-red-700 font-medium" +
          " transition-colors" +
          " duration-300" +
          " ease-out hover:bg-neutral-200/50 dark:hover:bg-neutral-800 p-1.25 px-2"
        }
      >
        <TrashIcon isRed={true} />
        <p>Удалить чат</p>
      </button>
    </motion.div>
  );
}
