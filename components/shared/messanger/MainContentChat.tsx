import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  AnimatePresence,
  DragControls,
  motion,
  useMotionValue,
  useMotionValueEvent,
} from "framer-motion";
import useCurrentWidth from "@/hooks/useCurrentWidth";
import { IMessages } from "./MainChat";
import CustomScrollbarDesktop from "./CustomScrollbarDesktop";
import useVirtualizeChunks from "@/hooks/useVirtualizeChunks.ts";
import CardMessage from "@/components/shared/messanger/CardMessage.tsx";
import ButtonToBottomChat from "@/components/shared/messanger/ButtonToBottomChat.tsx";
import { useSearchParams } from "next/navigation";
import useSocket from "@/hooks/useSocket.ts";
import useRefCallback from "@/hooks/useRefCallback.ts";
import {
  decrypt,
  getHistoryMessages,
} from "@/components/ui/messanger/actions.ts";
import { flushSync } from "react-dom";
import useDataUser from "@/hooks/useDataUser.ts";
import DatePanel from "@/components/shared/messanger/DatePanel.tsx";

export function MainContentChat({
  yControls,
  props,
  targetRef,
  containerRef,
  refView,
  containerDesktopRef,
  hasMore,
  cursor,
}: {
  cursor: string;
  hasMore: boolean;
  containerDesktopRef: RefObject<HTMLDivElement | null>;
  refView: RefObject<HTMLDivElement | null>;
  yControls: DragControls;
  props: IMessages[];
  targetRef: (node: HTMLDivElement | null) => void;
  containerRef: RefObject<HTMLDivElement | null>;
}) {
  const width = useCurrentWidth();
  const [maxDragTop, setMaxDragTop] = useState<number>(0);
  const y = useMotionValue(0);
  const heightViewContainer = useRef<number>(0);
  const prevDeffVisualView = useRef<number>(0);
  const stableHeightVisualViewport = useRef<number>(window.screen.height || 0);
  const yOffset = useRef<number>(0);
  const maxDragTopPrev = useRef<number>(0);
  const dragYProgressActual = useRef<number>(0);
  const [heightContainerMessages, setHeightContainerMessages] =
    useState<number>(0);
  const [topVisibleArea, setTopVisibleArea] = useState<number>(0);
  const [bottomVisibleArea, setBottomVisibleArea] = useState<number>(0);
  const [visibleButtonToBottom, setVisibleButtonToBottom] =
    useState<boolean>(false);
  const { targetRef: targetInvisibleContainer, ref: invisibleContainerRef } =
    useRefCallback<HTMLDivElement>();
  const [hasMoreFetch, setHasMoreFetch] = useState<boolean>(hasMore);
  const [cursorFetch, setCursorFetch] = useState<string>(cursor);
  const [isLarger, setIsLarger] = useState<boolean>();
  const [bottomContainer, setBottomContainer] = useState<number>(54);
  const isInitialMount = useRef<boolean>(true);
  const isFetchHistory = useRef<boolean>(false);
  const [isFetchHistoryState, setIsFetchHistoryState] =
    useState<boolean>(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const [visibleDatePanel, setVisibleDatePanel] = useState<boolean>(false);
  const {
    addNewMessage,
    addHistoryMessage,
    visibleChunks,
    chunksForInvisibleContainer,
    stableHeightContainer,
    chunks,
    dateVisible,
  } = useVirtualizeChunks<IMessages>({
    invisibleContainerRef: invisibleContainerRef,
    maxLengthInChunk: 50,
    buffer: 500,
    topVisible: topVisibleArea,
    bottomVisible: bottomVisibleArea,
    y: y,
    yOffset: yOffset,
  });
  useEffect(() => {
    if (props.length === 0 || chunks.length > 0) return;
    if (isInitialMount.current) {
      addNewMessage(props);
      isInitialMount.current = false;
    }
  }, [props]);
  const searchParams = useSearchParams();
  const chatId = searchParams.get("chatId");
  const loginChat = searchParams.get("login");
  useMotionValueEvent(y, "change", (latest) => {
    if (chunks.length === 0) {
      y.set(0);
      return;
    }
    yOffset.current = latest;
    dragYProgressActual.current = latest;
    requestAnimationFrame(() => {
      if (containerRef.current && refView.current) {
        const messagesRect = containerRef.current.getBoundingClientRect();
        const viewRect = refView.current.getBoundingClientRect();
        const topVisible = Math.max(0, viewRect.top - messagesRect.top);
        const bottomVisible = topVisible + refView.current.clientHeight;
        setBottomVisibleArea(bottomVisible);
        setTopVisibleArea(topVisible);
      }
      if (maxDragTop - Math.abs(latest) >= 500 && !visibleButtonToBottom) {
        setVisibleButtonToBottom(true);
      } else if (maxDragTop - Math.abs(latest) < 300 && visibleButtonToBottom) {
        setVisibleButtonToBottom(false);
      }
    });

    if (
      Math.abs(latest) <= 200 &&
      hasMoreFetch &&
      !isFetchHistory.current &&
      chatId &&
      loginChat
    ) {
      isFetchHistory.current = true;
      setIsFetchHistoryState(true);
      try {
        getHistoryMessages(chatId, loginChat, cursorFetch).then((data) => {
          if (data.ok) {
            flushSync(() => {
              setHasMoreFetch(data.hasMore);
            });
            setCursorFetch(data.newCursor);
            addHistoryMessage(data.newMessages.reverse());
            requestAnimationFrame(() => {
              isFetchHistory.current = false;
              setIsFetchHistoryState(false);
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
    setVisibleDatePanel(true);
    if (timer.current) {
      clearTimeout(timer.current);
    }
    timer.current = setTimeout(() => {
      setVisibleDatePanel(false);
    }, 800);
  });
  useLayoutEffect(() => {
    if (window.visualViewport) {
      stableHeightVisualViewport.current = window.visualViewport.height;
    }
  }, []);
  useEffect(() => {
    if (!refView.current || !containerRef.current) return;
    const containerMessages = containerRef.current;
    function updateTopDrag() {
      if (
        window.visualViewport &&
        refView.current &&
        chunks.length > 0 &&
        containerDesktopRef.current &&
        containerRef.current
      ) {
        setHeightContainerMessages(containerRef.current.clientHeight);
        const footerHeight = 54;
        const headerHeight = 65;
        setIsLarger(
          refView.current.clientHeight < containerRef.current.clientHeight,
        );
        const heightConstView =
          width < 1024
            ? stableHeightVisualViewport.current
            : containerDesktopRef.current.clientHeight;
        const defaultHeightViewContainer =
          heightConstView - footerHeight - headerHeight;
        const heightContainer = containerMessages.clientHeight;
        const maxDragTopCalculated =
          heightContainer - heightViewContainer.current;
        if (maxDragTopCalculated < 0) return;
        setMaxDragTop(maxDragTopCalculated);

        const deffVisualView =
          defaultHeightViewContainer - heightViewContainer.current;
        y.stop();
        const newOffsetNotMessage =
          yOffset.current + prevDeffVisualView.current - deffVisualView;
        if (yOffset.current !== 0) {
          y.set(newOffsetNotMessage);
        }
        prevDeffVisualView.current = deffVisualView;
      }
    }

    const observer = new ResizeObserver(([entry]) => {
      heightViewContainer.current = entry.contentRect.height;
      updateTopDrag();
      if (containerDesktopRef.current && refView.current && !isLarger) {
        setBottomContainer(
          containerDesktopRef.current.clientHeight -
            refView.current.clientHeight -
            65,
        );
      }
    });
    observer.observe(refView.current);
    updateTopDrag();
    return () => {
      observer.disconnect();
    };
  }, [
    chunks,
    containerRef,
    refView,
    heightViewContainer,
    width,
    containerDesktopRef,
  ]);
  useEffect(() => {
    y.stop();
    if (
      maxDragTopPrev.current + yOffset.current === 0 ||
      (maxDragTopPrev.current + yOffset.current < 40 &&
        maxDragTopPrev.current + yOffset.current > 0)
    ) {
      y.set(-maxDragTop);
      maxDragTopPrev.current = maxDragTop;
    } else {
      maxDragTopPrev.current = maxDragTop;
    }
  }, [chunks, maxDragTop, y]);

  useEffect(() => {
    const targetContainer = containerRef.current;
    if (!targetContainer) return;

    function mouseWheel(e: WheelEvent) {
      e.preventDefault();
      const step = 40;
      const delta = e.deltaY < 0 ? step : -step;
      const next = yOffset.current + delta;
      const nextOffset = Math.min(0, Math.max(-maxDragTop, next));
      y.set(nextOffset);
    }

    targetContainer.addEventListener("wheel", mouseWheel, { passive: false });
    return () => {
      targetContainer.removeEventListener("wheel", mouseWheel);
    };
  }, [containerRef, maxDragTop]);
  const { socket } = useSocket();
  useEffect(() => {
    socket.on("newMessage", async (res) => {
      const message = await decrypt(res.newMessage.text);
      const updateMessage = {
        ...res.newMessage,
        text: message,
      };
      addNewMessage([updateMessage]);
    });
    return () => {
      socket.off("newMessage");
    };
  }, [addNewMessage, chunks, socket]);
  useEffect(() => {
    socket.on("successful", () => {
      y.set(-maxDragTop);
    });
  }, [maxDragTop, socket]);

  const userData = useDataUser();
  const timeCurrentYearForPanel = useMemo(() => {
    return new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "long" });
  }, []);
  const timeOldYearForPanel = useMemo(() => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, []);
  const timeFormatterForDatePanel = useCallback(
    (date: Date) => {
      const now = new Date(new Date().setHours(0, 0, 0, 0));
      const dateConst = new Date(new Date(date).setHours(0, 0, 0, 0));
      if (now.getTime() === dateConst.getTime()) {
        return "Сегодня";
      } else {
        if (now.getFullYear() !== dateConst.getFullYear()) {
          return timeOldYearForPanel.format(dateConst).replace("г.", "");
        }
      }
      return timeCurrentYearForPanel.format(dateConst);
    },
    [timeCurrentYearForPanel, timeOldYearForPanel],
  );
  const timeForMessages = useMemo(() => {
    return new Intl.DateTimeFormat("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);
  const advancedTimeForMessages = useMemo(() => {
    return new Intl.DateTimeFormat("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    });
  }, []);
  const timeFormatterForMessages = useCallback(
    (date: Date, isAdvanced: boolean) => {
      if (isAdvanced) {
        return advancedTimeForMessages.format(new Date(date)).replace("в ", "");
      } else {
        return timeForMessages.format(new Date(date));
      }
    },
    [],
  );
  return (
    <>
      <motion.div
        ref={targetRef}
        drag="y"
        dragListener={false}
        dragControls={yControls}
        dragElastic={width >= 1024 ? 0 : 1}
        dragMomentum={width < 1024}
        transition={{ type: "tween" }}
        dragConstraints={{ top: -maxDragTop, bottom: 0 }}
        style={{
          touchAction: "none",
          y,
          minHeight: `${stableHeightContainer}px`,
          bottom: `${isLarger ? "auto" : `${bottomContainer}px`}`,
        }}
        className={`overflow-y-hidden flex flex-col absolute inset-x-0 px-2.5 py-1.25 z-10 ${chunks.length === 0 && "inset-y-0"}`}
      >
        <div
          className={`relative ${chunks.length === 0 && "flex items-center justify-center flex-1"}`}
        >
          {chunks.length > 0 ? (
            visibleChunks.map((chunk) => {
              return (
                <div
                  key={chunk.id}
                  className={"absolute w-full flex flex-col "}
                  style={{ top: `${chunk.topPosition}px` }}
                >
                  {chunk.arrayElements.map((message) => {
                    return (
                      <CardMessage
                        props={message}
                        key={message.id}
                        currentIdUser={userData?.id || ""}
                        timeFormatterDate={timeFormatterForMessages}
                      />
                    );
                  })}
                </div>
              );
            })
          ) : (
            <p
              className={
                "text-center text-neutral-800 dark:text-neutral-200 font-medium bg-white dark:bg-neutral-800  p-2.5" +
                " rounded-md select-none"
              }
            >
              У вас нет сообщений <br />
              Отправьте сообщение для начала общения
            </p>
          )}
        </div>
      </motion.div>
      <div
        ref={targetInvisibleContainer}
        style={{ width: `${containerRef.current?.clientWidth}px` }}
        className={
          "invisible fixed overflow-y-hidden flex flex-col inset-x-0 px-2.5 "
        }
      >
        {chunksForInvisibleContainer.map((chunk) => {
          return (
            <div
              key={chunk.id + "invisible"}
              className={"w-full flex flex-col "}
            >
              {chunk.arrayElements.map((message) => {
                return (
                  <CardMessage
                    currentIdUser={userData?.id || ""}
                    props={message}
                    key={message.id + "invisible"}
                    timeFormatterDate={timeFormatterForMessages}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {width >= 1024 && (
        <CustomScrollbarDesktop
          isScrollingStop={isFetchHistoryState}
          containerMessagesHeight={heightContainerMessages}
          y={y}
          refView={refView}
          yOffset={yOffset}
          maxDragTop={maxDragTop}
        />
      )}
      <AnimatePresence>
        {visibleButtonToBottom && (
          <ButtonToBottomChat refView={refView} y={y} maxDragTop={maxDragTop} />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {visibleDatePanel && (
          <DatePanel
            date={dateVisible}
            timeFormatterDate={timeFormatterForDatePanel}
          />
        )}
      </AnimatePresence>
    </>
  );
}
