import useCurrentWidth from "@/hooks/useCurrentWidth";
import { useRouter, useSearchParams } from "next/navigation";
import HeaderChat from "./HeaderChat";
import { MainContentChat } from "./MainContentChat";
import FooterChat from "./FooterChat";
import React, { useEffect, useState } from "react";
import useLoader from "@/hooks/useLoader";
import { getChat } from "@/components/ui/messanger/actions";
import useSocket from "@/hooks/useSocket";
import useRefCallback from "@/hooks/useRefCallback";
import { DragControls } from "framer-motion";

export interface IUserData {
  login: string;
  avatar: string | null;
  isOnline: boolean;
  role: string;
}
export interface IMessages {
  id: string;
  createdAt: Date;
  text: string;
  authorId: string;
}

export default function MainChat({ yControls }: { yControls: DragControls }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const login = searchParams.get("login");
  const width = useCurrentWidth();
  const isMobile = width < 1024;
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const { setLoading } = useLoader();
  const [messages, setMessages] = React.useState<IMessages[]>([]);
  const [userData, setUserData] = React.useState<IUserData>({
    login: "",
    avatar: "",
    isOnline: false,
    role: "",
  });
  const [cursor, setCursor] = useState<string>("");
  const { onlineList } = useSocket();
  const { targetRef: containerMessagesTarget, ref: containerMessagesRef } =
    useRefCallback<HTMLDivElement>();
  const [hasMore, setHasMore] = useState<boolean>(false);
  useEffect(() => {
    const checkOnline = onlineList.some(
      (user) => user.login === userData.login,
    );
    if (checkOnline && !userData.isOnline) {
      setUserData((prev) => {
        return { ...prev, isOnline: true };
      });
    } else if (!checkOnline && userData.isOnline) {
      setUserData((prev) => {
        return { ...prev, isOnline: false };
      });
    }
  }, [onlineList, userData]);
  const [block, setBlock] = useState<boolean>(true);
  useEffect(() => {
    setBlock(true);
    if (!chatId || !login) {
      return;
    }
    setLoading(async () => {
      const res = await getChat(chatId, login);
      if (res.ok && res.chatData) {
        setCursor(res.cursor);
        if (res.chatData.Chats.length > 0) {
          setMessages(res.chatData.Chats[0].MessagesChats.reverse());
          setBlock(false);
        } else {
          setMessages([]);
          setBlock(false);
        }
        setUserData({
          login: res.chatData.login,
          avatar: res.chatData.avatar,
          isOnline: res.chatData.isOnline,
          role: res.chatData.role,
        });
        setHasMore(res.hasMore);
      } else if (!res.ok) {
        router.replace("/invalid");
        return;
      }
    });
  }, [chatId, login]);

  useEffect(() => {
    function scrollWindow() {
      window.scrollTo(0, 0);
    }
    function resizeViewport() {
      containerRef.current?.style.setProperty(
        "height",
        `${window.visualViewport?.height}px`,
      );
    }
    if (isMobile) {
      window.addEventListener("scroll", scrollWindow);
      window.visualViewport?.addEventListener("resize", resizeViewport);
    } else {
      window.removeEventListener("scroll", scrollWindow);
      window.visualViewport?.removeEventListener("resize", resizeViewport);
    }
    return () => {
      window.removeEventListener("scroll", scrollWindow);
      window.visualViewport?.removeEventListener("resize", resizeViewport);
    };
  }, [isMobile]);
  const { targetRef: targetRefViewPlace, ref: refView } =
    useRefCallback<HTMLDivElement>();
  if (width === 0) {
    return null;
  }
  return (
    <div
      ref={containerRef}
      className="bg-neutral-100 dark:bg-[#1d1d1d] absolute inset-0 z-101 flex lg:rounded-lg lg:border border-neutral-300 dark:border-neutral-700 flex-col overflow-clip"
    >
      <HeaderChat props={userData} />
      <div ref={targetRefViewPlace} className="flex-1 overflow-hidden">
        {!block && (
          <MainContentChat
            cursor={cursor}
            hasMore={hasMore}
            containerDesktopRef={containerRef}
            refView={refView}
            yControls={yControls}
            props={messages}
            containerRef={containerMessagesRef}
            targetRef={containerMessagesTarget}
          />
        )}
      </div>
      <FooterChat containerMessagesRef={containerMessagesRef} />
    </div>
  );
}
