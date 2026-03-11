import { IMessages } from "@/components/shared/messanger/MainChat.tsx";
import { montserrat } from "@/styles/font.ts";
import { memo, useEffect, useRef, useState } from "react";
import usePanelAdvancedTime from "@/hooks/usePanelAdvancedTime.ts";
import useCurrentWidth from "@/hooks/useCurrentWidth.tsx";
import useSocket from "@/hooks/useSocket.ts";
import ReadCheckMark from "@/components/shared/icons/ReadCheckMark.tsx";
import UnreadCheckMark from "@/components/shared/icons/UnreadCheckMark.tsx";
import useDataUser from "@/hooks/useDataUser.ts";

function CardMessage({
  props,
  timeFormatterDate,
  currentIdUser,
}: {
  currentIdUser: string;
  timeFormatterDate: (date: Date, isAdvanced: boolean) => string;
  props: IMessages;
}) {
  const { text, createdAt, authorId } = props;
  const {
    setIsOpenPanel,
    setPosition,
    setConvertedDate,
    setIsAuthor,
    isOpenPanel,
  } = usePanelAdvancedTime();
  const convertedDate = timeFormatterDate(createdAt, false);
  const convertedTimeForAdvanced = timeFormatterDate(createdAt, true);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const width = useCurrentWidth();
  const [isRead, setIsRead] = useState<boolean>(props.isRead);
  const { socket } = useSocket();
  useEffect(() => {
    socket.on("chatIsRead", () => {
      if (!props.isRead) {
        setIsRead(true);
      }
    });
  }, [props.isRead, socket]);
  const userData = useDataUser();
  return (
    <div
      className={`select-none w-full  flex pt-1.25  ${authorId === currentIdUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`relative max-w-95/100 lg:max-w-4/5 px-2.5 py-1.25 rounded-2xl overflow-clip inline-block ${authorId === currentIdUser ? "bg-orange-200 dark:bg-orange-900" : "bg-white dark:bg-neutral-800"}`}
      >
        <pre
          className={`inline whitespace-pre-wrap wrap-break-word min-w-0 select-text ${montserrat.className}`}
        >
          {text}
        </pre>
        <span
          className={`text-sm pt-1.25 pl-5 font-light  inline-flex align-bottom invisible gap-2.5 flex-row`}
        >
          {convertedDate}
          {props.authorId === userData?.id && (
            <span>{isRead ? <ReadCheckMark /> : <UnreadCheckMark />}</span>
          )}
        </span>
        <span
          onMouseEnter={
            width >= 1024
              ? () => {
                  if (timer.current) {
                    clearTimeout(timer.current);
                  }
                  timer.current = setTimeout(() => {
                    setIsOpenPanel(true);
                    setConvertedDate(convertedTimeForAdvanced);
                    setIsAuthor(authorId === currentIdUser);
                  }, 2000);
                }
              : undefined
          }
          onMouseMove={
            width >= 1024
              ? (e) => {
                  if (!isOpenPanel) {
                    setPosition({ x: e.clientX, y: e.clientY });
                  }
                }
              : undefined
          }
          onMouseLeave={
            width >= 1024
              ? () => {
                  setIsOpenPanel(false);
                  if (timer.current) {
                    clearTimeout(timer.current);
                  }
                }
              : undefined
          }
          className={`absolute text-sm bottom-1.25 right-2.5 flex flex-row items-center gap-2.5 ${
            authorId === currentIdUser
              ? "text-orange-900" + " dark:text-orange-100"
              : "text-neutral-700 dark:text-neutral-300"
          }`}
        >
          {convertedDate}
          {props.authorId === userData?.id && (
            <span>{isRead ? <ReadCheckMark /> : <UnreadCheckMark />}</span>
          )}
        </span>
      </div>
    </div>
  );
}
export default memo(CardMessage);
