import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { IChats } from "@/components/ui/messanger/actions.ts";
import AvatarUser from "@/components/shared/users/AvatarUser.tsx";
import { useRouter, useSearchParams } from "next/navigation";
import useCurrentWidth from "@/hooks/useCurrentWidth.tsx";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import TrashIcon from "@/components/shared/icons/TrashIcon.tsx";
import useContextMenu from "@/hooks/useContextMenu.ts";
import useSocket from "@/hooks/useSocket.ts";
import UnreadCheckMark from "@/components/shared/icons/UnreadCheckMark.tsx";
import useDataUser from "@/hooks/useDataUser.ts";
import ReadCheckMark from "@/components/shared/icons/ReadCheckMark.tsx";

export default function CardChat({
  props,
  targetRefScrollLastElem,
  timeFormatterDate,
  setChats,
}: {
  setChats: Dispatch<SetStateAction<IChats[]>>;
  timeFormatterDate: (date: Date) => string;
  props: IChats;
  targetRefScrollLastElem?: (node: HTMLDivElement | null) => void;
}) {
  const userData = props.Users[0];
  const dataUser = useDataUser();
  const convertedDate = timeFormatterDate(props.lastMessageTime);
  const {
    setLoginChatState,
    setChatIdState,
    chatIdState,
    loginChatState,
    setOpenedContextMenu,
    setPosition,
    deleteChatFunction,
    setIsDrag,
  } = useContextMenu();
  const { writingUsers } = useSocket();
  const isTyping = writingUsers.includes(props.Users[0].login);
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const loginChat = searchParams.get("login");
  const width = useCurrentWidth();
  const x = useMotionValue(0);
  const maxDrag = Math.floor(width * 0.25);
  const openedProgress = useTransform(x, [-maxDrag, 0], [maxDrag, 0]);
  const variants = {
    opened: { x: -maxDrag },
    closed: { x: 0 },
  };
  const [block, setBlock] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function closeCard(e: Event) {
      if (!cardRef.current?.contains(e.target as Node)) {
        if (width < 1024) {
          setChatIdState(null);
          setLoginChatState(null);
          setIsDrag(false);
        }
      }
    }

    if (chatIdState === props.id) {
      document.addEventListener("pointerdown", closeCard);
    }
    return () => {
      document.removeEventListener("pointerdown", closeCard);
    };
  }, [chatIdState, props.id]);
  const startX = useRef<number>(0);
  const startY = useRef<number>(0);
  const { socket } = useSocket();
  useEffect(() => {
    function emit() {
      if (
        props.id === chatId &&
        props._count.MessagesChats > 0 &&
        props.MessagesChats[0].authorId !== dataUser?.id
      ) {
        socket.emit("readChat", { chatId, loginChat });
      }
    }
    if (socket.connected) {
      emit();
    } else {
      socket.once("reconnect", emit);
    }
  }, [chatId, loginChat, props._count.MessagesChats, props.id, socket]);
  useEffect(() => {
    socket.on("chatIsRead", (data) => {
      setChats((prevState) =>
        prevState.map((ch) => {
          if (ch.id === data.chatId) {
            return {
              ...ch,
              _count: {
                MessagesChats: 0,
              },
              MessagesChats: [
                {
                  text: ch.MessagesChats[0].text,
                  authorId: ch.MessagesChats[0].authorId,
                  isRead: true,
                },
              ],
            };
          }
          return ch;
        }),
      );
    });
  }, [socket]);
  return (
    <motion.div
      onMouseUp={(e) => {
        if (e.button === 2) {
          setOpenedContextMenu(true);
          setChatIdState(props.id);
          setLoginChatState(props.Users[0].login);
          setPosition({ x: e.clientX, y: e.clientY });
          setIsDrag(true);
        }
      }}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      ref={(node) => {
        cardRef.current = node;
        targetRefScrollLastElem?.(node);
      }}
      layout="position"
      className={`select-none flex flex-row relative w-full overflow-clip py-2.5 pl-2.5 cursor-pointer ${(chatId === props.id && userData.login === loginChat) || (width >= 1024 && chatIdState === props.id && userData.login === loginChatState) ? "bg-neutral-200/50 dark:bg-neutral-700/50" : "hover:bg-neutral-200/25 dark:hover:bg-neutral-700/25"} transition-colors duration-300 ease-out`}
    >
      <motion.div
        onClick={
          block
            ? undefined
            : () => {
                router.push(
                  `/messenger?chatId=${props.id}&login=${userData.login}`,
                );
              }
        }
        onAnimationStart={() => setBlock(true)}
        onAnimationComplete={() => setBlock(false)}
        className={"flex flex-row items-center gap-2.5 w-full pr-2.5"}
        drag={width < 1024 && "x"}
        dragElastic={0}
        dragMomentum={false}
        dragListener={!block}
        dragDirectionLock={true}
        variants={width < 1024 ? variants : undefined}
        animate={chatIdState === props.id ? "opened" : "closed"}
        transition={{ type: "tween" }}
        style={{ x }}
        dragConstraints={{ left: -maxDrag, right: 0 }}
        onPointerDown={
          width < 1024
            ? (e) => {
                startX.current = e.clientX;
                startY.current = e.clientY;
              }
            : undefined
        }
        onPointerMove={
          width < 1024
            ? (e) => {
                const curX = e.clientX;
                const curY = e.clientY;
                const dx = Math.abs(curX - startX.current);
                const dy = Math.abs(curY - startY.current);
                if (dx > dy && dx > 10) {
                  setIsDrag(true);
                }
              }
            : undefined
        }
        onDragEnd={(e, info) => {
          const delta = info.offset.x > 0 ? 1 : -1;
          const offset = info.offset.x;
          const trigger = maxDrag * delta * 0.2;
          if (delta === 1) {
            if (offset < trigger && Math.abs(info.offset.y) < info.offset.x) {
              setChatIdState(props.id);
              setLoginChatState(props.Users[0].login);
              animate(x, -maxDrag);
            } else {
              setChatIdState(null);
              setLoginChatState(null);
            }
          } else {
            if (offset > trigger) {
              setChatIdState(null);
              setLoginChatState(null);
              animate(x, 0);
            } else {
              setChatIdState(props.id);
              setLoginChatState(props.Users[0].login);
            }
          }
          setIsDrag(false);
        }}
      >
        <AvatarUser
          props={{
            role: userData.role,
            avatar: userData.avatar || undefined,
            width: 50,
            height: 50,
          }}
        />
        <div className={"flex flex-col w-full min-w-0"}>
          <div className={"flex flex-row justify-between w-full"}>
            <p
              className={`truncate min-w-0 flex-1 font-medium ${chatId === props.id && userData.login === loginChat ? "text-neutral-900 dark:text-neutral-100" : "text-neutral-700 dark:text-neutral-300"}`}
            >
              {userData.login}
            </p>
            <div className={"flex flex-row shrink-0 items-center"}>
              {props.MessagesChats[0].authorId === dataUser?.id &&
                (props.MessagesChats[0].isRead ? (
                  <ReadCheckMark />
                ) : (
                  <UnreadCheckMark />
                ))}
              <p
                className={`shrink-0 whitespace-nowrap text-sm font-light ml-1.25 ${chatId === props.id && userData.login === loginChat ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-700 dark:text-neutral-300 "} `}
              >
                {convertedDate}
              </p>
            </div>
          </div>
          <div
            className={
              "flex flex-row justify-between w-full gap-2.5 items-center"
            }
          >
            <p
              className={`text-sm truncate  ${
                isTyping
                  ? "animate-pulse" + " text-emerald-400 dark:text-emerald-500"
                  : chatId === props.id && userData.login === loginChat
                    ? "text-neutral-900" + " dark:text-neutral-100"
                    : "text-neutral-700 dark:text-neutral-300"
              }`}
            >
              {isTyping ? "Печатает..." : props.MessagesChats[0].text}
            </p>
            {props._count.MessagesChats > 0 &&
              props.MessagesChats[0].authorId !== dataUser?.id && (
                <p
                  className={
                    "bg-orange-500 dark:bg-orange-600 rounded-full shrink-0 px-1.25 min-w-6 text-center text-neutral-100"
                  }
                >
                  {props._count.MessagesChats}
                </p>
              )}
          </div>
        </div>
      </motion.div>
      <motion.button
        onClick={() => {
          deleteChatFunction();
          setLoginChatState(null);
          setChatIdState(null);
          setIsDrag(false);
        }}
        style={{
          width: openedProgress,
        }}
        className={
          "absolute bg-red-500 right-0 origin-right inset-y-0 overflow-clip flex items-center justify-center flex-col"
        }
      >
        <TrashIcon />
        <p className={"text-xs text-white font-medium"}>Удалить</p>
      </motion.button>
    </motion.div>
  );
}
