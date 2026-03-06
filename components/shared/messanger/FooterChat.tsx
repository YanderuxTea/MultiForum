import useCurrentWidth from "@/hooks/useCurrentWidth";
import React, { RefObject, useEffect, useRef, useState } from "react";
import Arrow from "../icons/Arrow";
import { AnimatePresence, motion } from "framer-motion";
import useSocket from "@/hooks/useSocket.ts";
import { useSearchParams } from "next/navigation";
import useNotify from "@/hooks/useNotify.ts";
import LoadingSendMessage from "@/components/shared/stubs/LoadingSendMessage.tsx";

export default function FooterChat({
  containerMessagesRef,
}: {
  containerMessagesRef: RefObject<HTMLDivElement | null>;
}) {
  const areaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const searchParams = useSearchParams();
  const width = useCurrentWidth();
  const isMobile = width < 1024;
  const [message, setMessage] = React.useState<string>("");
  const footerRef = useRef<HTMLDivElement | null>(null);
  function changeText(text: string) {
    const el = areaRef.current;
    const containerMessages = containerMessagesRef.current;
    if (!el || !containerMessages || !footerRef.current) return;
    setMessage(text);
    el.style.height = "auto";
    const lineHeight = 24;
    const maxHeight = isMobile ? 4 * lineHeight : 12 * lineHeight;
    const textJSON = JSON.stringify(text);
    const scrollHeight = textJSON.includes("\\n")
      ? el.scrollHeight
      : text.trim().length === 0
        ? lineHeight
        : el.scrollHeight;
    const calculateHeight = scrollHeight > maxHeight ? maxHeight : scrollHeight;
    el.style.setProperty("height", `${calculateHeight}px`);
  }
  const { socket } = useSocket();
  const { setMessage: setMessageNotify, setIsNotify } = useNotify();
  const [block, setBlock] = useState<boolean>(false);
  async function sendMessage() {
    const text = message.trim();
    if (text.length > 0 && !block) {
      if (text.length > 2000) {
        setMessageNotify(
          "Ошибка: длина сообщения не может превышать 2000 символов",
        );
        setIsNotify(true);
        return;
      }
      setBlock(true);
      const loginChat = searchParams.get("login");
      const chatId = searchParams.get("chatId");
      if (!chatId || !loginChat) return;
      if (socket.connected) {
        socket.emit("sendMessage", { text, chatId, loginChat });
      } else {
        setMessageNotify(`Ошибка: сервер недоступен`);
        setIsNotify(true);
        setBlock(false);
      }
    } else {
      return;
    }
  }
  useEffect(() => {
    socket.on("errorSendMessage", () => {
      setMessageNotify(
        "Ошибка: длина сообщения не может превышать 2000 символов",
      );
      setIsNotify(true);
      setBlock(false);
    });
    socket.on("successful", () => {
      setBlock(false);
      changeText("");
    });
    return () => {
      socket.off("successful");
      socket.off("errorSendMessage");
    };
  }, [socket]);
  return (
    <div
      ref={footerRef}
      className={`p-2.5 bg-white dark:bg-[#212121]  ${width < 1024 ? "border-y" : "border-t"} border-neutral-300 dark:border-neutral-700 lg:rounded-b-lg flex items-center min-h-13.5 overflow-clip gap-0.5 z-50`}
    >
      <textarea
        ref={areaRef}
        value={message}
        rows={1}
        readOnly={block}
        onChange={block ? undefined : (e) => changeText(e.target.value)}
        id="messageInput"
        placeholder="Сообщение..."
        maxLength={2000}
        onKeyDown={
          width < 1024
            ? undefined
            : (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (message.trim().length > 0) {
                    sendMessage();
                  } else {
                    return;
                  }
                }
              }
        }
        className=" resize-none w-full outline-none touch-pan-y"
      />
      <AnimatePresence>
        {message.trim().length > 0 && (
          <motion.button
            onMouseDown={(e) => {
              e.preventDefault();
            }}
            onTouchStart={(e) => {
              e.preventDefault();
            }}
            disabled={block}
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            exit={{ y: 50 }}
            className="-rotate-90 cursor-pointer shrink-0 p-1 rounded-full bg-neutral-200 dark:bg-neutral-700 disabled:cursor-not-allowed disabled:bg-neutral-300 dark:disabled:bg-neutral-600 transition-colors duration-300 ease-out"
            onClick={
              block
                ? undefined
                : () => {
                    sendMessage();
                  }
            }
          >
            {block ? <LoadingSendMessage disabled={block} /> : <Arrow />}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
