import React, {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import CardChat from "./CardChat";
import useObserver from "@/hooks/useObserver";
import {
  decrypt,
  getChats,
  IChats,
} from "@/components/ui/messanger/actions.ts";
import useSocket from "@/hooks/useSocket.ts";
import useDataUser from "@/hooks/useDataUser.ts";
import useCurrentWidth from "@/hooks/useCurrentWidth.tsx";
import useContextMenu from "@/hooks/useContextMenu.ts";
import { useRouter, useSearchParams } from "next/navigation";

export default function MainContentMessanger({
  refContainer,
  targetRef,
  setIsScroll,
}: {
  setIsScroll: React.Dispatch<React.SetStateAction<boolean>>;
  targetRef: (node: HTMLDivElement | null) => void;

  refContainer: RefObject<HTMLDivElement | null>;
}) {
  const [chats, setChats] = React.useState<IChats[]>([]);
  const {
    isVisible: isVisibleScrollLastElem,
    targetRef: targetRefScrollLastElem,
  } = useObserver({ container: refContainer, margin: 50 });
  const {
    isVisible: isVisibleForFetchNewChats,
    targetRef: targetRefFetchNewChats,
  } = useObserver({ container: refContainer, margin: 200 });
  const combinedRef = React.useCallback(
    (node: HTMLDivElement | null) => {
      targetRefFetchNewChats(node);
      targetRefScrollLastElem(node);
    },
    [targetRefFetchNewChats, targetRefScrollLastElem],
  );
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [cursor, setCursor] = React.useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  async function fetchChats(firstRender: boolean) {
    if (!hasMore || loading) return;
    setLoading(true);
    const chatsReq = await getChats(cursor);
    if (chatsReq.ok) {
      setCursor(chatsReq.newCursor);
      setHasMore(chatsReq.hasMore);
      if (firstRender) {
        setChats(chatsReq.chats);
      } else {
        setChats((prevState) => [...prevState, ...chatsReq.chats]);
      }
    } else {
      return;
    }
    setLoading(false);
  }
  React.useEffect(() => {
    if (chats.length === 0) {
      fetchChats(true);
    }
  }, [chats.length]);

  React.useEffect(() => {
    if (isVisibleForFetchNewChats && hasMore) {
      fetchChats(false);
    }
  }, [hasMore, isVisibleForFetchNewChats, chats.length]);
  const { scrollY } = useScroll({ container: refContainer });
  const width = useCurrentWidth();
  const { isDrag } = useContextMenu();
  const router = useRouter();
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (width >= 1024) {
      setIsScroll(false);
      return;
    }
    const previous = scrollY.getPrevious();
    if (!previous) return;
    if (latest <= 57) {
      setIsScroll(false);
      return;
    }
    if (isVisibleScrollLastElem) {
      setIsScroll(true);
      return;
    }
    if (latest > previous) {
      setIsScroll(true);
    } else if (latest <= previous) {
      setIsScroll(false);
    }
  });
  const { socket } = useSocket();
  const userData = useDataUser();
  useEffect(() => {
    if (!userData) return;
    socket.on("createNewChat", async (res: IChats) => {
      const newUsers = res.Users.filter(
        (user) => user.login !== userData.login,
      );
      const decryptedText = await decrypt(res.MessagesChats[0].text);
      const newChat = {
        ...res,
        Users: newUsers,
        MessagesChats: [{ ...res.MessagesChats, text: decryptedText }],
      };
      setChats((prevState) => [newChat, ...prevState]);
    });
    socket.on("newMessageReceived", async (res) => {
      const newMess = {
        ...res.newMessage,
        text: await decrypt(res.newMessage.text as string),
      };
      const chatId = res.chatId;
      const newDate = res.newDate;
      const newId = res.newIdV7;
      setChats((prevState) => {
        const findChat = prevState.find((val) => {
          if (val.id === chatId) {
            return val;
          }
        });
        if (findChat) {
          const newArray = prevState.filter((val) => val.id !== chatId);
          const updatedChat = {
            ...findChat,
            lastMessageTime: newDate,
            idV7: newId,
            MessagesChats: [newMess],
          };

          return [updatedChat, ...newArray];
        } else {
          return prevState;
        }
      });
    });
    socket.on("successfulDeletingChat", (data: { id: string }) => {
      setChats((prevState) => prevState.filter((val) => val.id !== data.id));
      if (chatId) {
        if (chatId === data.id) {
          router.replace("/messenger");
        }
      }
    });
    return () => {
      socket.off("createNewChat");
      socket.off("newMessageReceived");
      setIsScroll(false);
    };
  }, [chatId, setIsScroll, socket, userData]);
  const timeFormatterToday = useMemo(() => {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "numeric",
      minute: "numeric",
    });
  }, []);
  const timeFormatterThisWeek = useMemo(() => {
    return new Intl.DateTimeFormat("ru-RU", { weekday: "short" });
  }, []);
  const timeFormatterOldest = useMemo(() => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);
  const timeFormatterForChatCard = useCallback(
    (date: Date): string => {
      const week = 1000 * 60 * 60 * 24 * 7;
      const now = new Date().setHours(0, 0, 0, 0);
      const dateConst = new Date(date).setHours(0, 0, 0, 0);
      const isToday = now === dateConst;
      const isThisWeek = now - dateConst < week;
      if (isToday) {
        return timeFormatterToday.format(new Date(date));
      } else {
        if (isThisWeek) {
          return (
            timeFormatterThisWeek
              .format(new Date(date))
              .charAt(0)
              .toUpperCase() +
            timeFormatterThisWeek.format(new Date(date)).slice(1)
          );
        } else {
          return timeFormatterOldest.format(new Date(date));
        }
      }
    },
    [timeFormatterOldest, timeFormatterThisWeek, timeFormatterToday],
  );
  return (
    <motion.div
      layout
      ref={targetRef}
      className={`${isDrag ? "overflow-hidden" : "overflow-y-auto"} min-h-0 flex flex-col grow h-dvw lg:h-lh overflow-clip divide-y divide-neutral-300 dark:divide-neutral-700 pt-14.25`}
    >
      {chats.length > 0 ? (
        chats.map((val, index) => {
          const isLast = index === chats.length - 1;
          return (
            <CardChat
              timeFormatterDate={timeFormatterForChatCard}
              targetRefScrollLastElem={isLast ? combinedRef : undefined}
              key={val.id}
              props={val}
            />
          );
        })
      ) : (
        <div className="grow flex items-center justify-center font-medium text-neutral-800 dark:text-neutral-200 select-none">
          <p className="text-center select-none">
            У вас нет чатов
            <br />
            Найдите в поиске пользователей
          </p>
        </div>
      )}
    </motion.div>
  );
}
