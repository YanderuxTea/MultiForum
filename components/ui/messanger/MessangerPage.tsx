"use client";

import FooterMobileMessanger from "@/components/shared/messanger/FooterMobileMessanger";
import HeaderMobileMessanger from "@/components/shared/messanger/HeaderMobileMessanger";
import MainChat from "@/components/shared/messanger/MainChat";
import MainContentMessanger from "@/components/shared/messanger/MainContentMessanger";
import SearchContent from "@/components/shared/messanger/SearchContent";
import SearchMessanger from "@/components/shared/messanger/SearchMessanger";
import StubHeader from "@/components/shared/stubs/StubHeader";
import StubUnderHeader from "@/components/shared/stubs/StubUnderHeader";
import SwitcherTheme from "@/components/shared/SwitcherTheme";
import useCurrentWidth from "@/hooks/useCurrentWidth";
import useRefCallback from "@/hooks/useRefCallback";
import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
} from "framer-motion";
import { notFound, useRouter, useSearchParams } from "next/navigation";

import React, { useEffect, useRef } from "react";
import ContextMenu from "@/components/shared/messanger/ContextMenu.tsx";
import useContextMenu from "@/hooks/useContextMenu.ts";
import usePanelAdvancedTime from "@/hooks/usePanelAdvancedTime.ts";
import PanelAdvancedTimeForMessage from "@/components/shared/messanger/PanelAdvancedTimeForMessage.tsx";

export default function MessangerPage() {
  const { messengerPageRefContainer } = useContextMenu();
  const x = useMotionValue(0);
  const width = useCurrentWidth();
  const searchParams = useSearchParams();
  const isSettings = searchParams.get("settings");
  const loginChat = searchParams.get("login");
  const chatId = searchParams.get("chatId");
  const [query, setQuery] = React.useState<string>("");
  const [isActiveSearch, setIsActiveSearch] = React.useState<boolean>(false);
  const { ref: inputSearchRef, targetRef: targetSearchInputRef } =
    useRefCallback<HTMLInputElement>();
  const { ref: mainContainerChats, targetRef } =
    useRefCallback<HTMLDivElement>();
  const yControls = useDragControls();
  const xControls = useDragControls();
  const xStart = useRef<number>(0);
  const yStart = useRef<number>(0);
  const xLock = useRef<boolean>(false);
  const yLock = useRef<boolean>(false);
  const router = useRouter();
  const [isScroll, setIsScroll] = React.useState<boolean>(false);
  if (isSettings && width >= 1024) {
    notFound();
  }
  useEffect(() => {
    function closeActive(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (isActiveSearch) {
          setQuery("");
          setIsActiveSearch(false);
          return;
        }
        if (loginChat && chatId) {
          router.replace("/messenger");
          return;
        }
      }
    }
    if (width < 1024) {
      window.document.body.style.overflow = "hidden";
      window.removeEventListener("keydown", closeActive);
    } else {
      window.document.body.style.overflow = "unset";
      window.addEventListener("keydown", closeActive);
    }
    return () => {
      window.document.body.style.overflow = "unset";
      window.removeEventListener("keydown", closeActive);
    };
  }, [width, isActiveSearch, chatId, loginChat]);
  useEffect(() => {
    if (!loginChat && chatId) {
      router.replace("/messenger");
    } else if (!chatId && loginChat) {
      router.replace("/messenger");
    }
  }, [loginChat, chatId]);
  const { openedContextMenu } = useContextMenu();
  const { isOpenPanel } = usePanelAdvancedTime();
  return (
    <div className="flex flex-col w-full max-w-300 mx-auto grow py-5 lg:z-0 ">
      {width >= 1024 && (
        <>
          <StubHeader />
          <StubUnderHeader />
        </>
      )}
      <div
        className="flex flex-row grow gap-2.5"
        ref={messengerPageRefContainer}
      >
        <div className="bg-white dark:bg-[#212121] fixed inset-0 z-100 flex flex-col lg:relative lg:w-1/3 lg:rounded-lg lg:border lg:border-neutral-300 dark:lg:border-neutral-700 overflow-clip">
          {width < 1024 && <HeaderMobileMessanger />}
          <div className="flex flex-col grow">
            {isSettings === "true" ? (
              <div className="flex flex-col grow justify-end">
                <div className="flex flex-row justify-between items-center border-t border-neutral-300 dark:border-neutral-700 p-2.5 font-medium text-neutral-800 dark:text-neutral-200">
                  <p>Тема:</p>
                  <SwitcherTheme />
                </div>
              </div>
            ) : (
              <>
                <AnimatePresence>
                  {!isScroll && (
                    <SearchMessanger
                      refSearch={inputSearchRef}
                      targetSearchInputRef={targetSearchInputRef}
                      query={query}
                      setQuery={setQuery}
                      setIsActiveSearch={setIsActiveSearch}
                      isActiveSearch={isActiveSearch}
                    />
                  )}
                </AnimatePresence>
                <AnimatePresence>
                  {isActiveSearch && (
                    <SearchContent
                      query={query}
                      refSearch={inputSearchRef}
                      setIsActiveSearch={setIsActiveSearch}
                      setQuery={setQuery}
                    />
                  )}
                </AnimatePresence>
                {width < 1024 && (
                  <AnimatePresence>
                    {loginChat && chatId ? (
                      <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        key={"containerChat"}
                        drag="x"
                        style={{ x }}
                        onDrag={(e, info) => {
                          if (info.offset.x < 0) {
                            x.set(0);
                          }
                        }}
                        onDragEnd={(e, info) => {
                          if (info.offset.x >= width / 10) {
                            router.replace("/messenger");
                          }
                        }}
                        dragElastic={1}
                        dragListener={false}
                        dragControls={xControls}
                        dragConstraints={{ left: 0, right: 0 }}
                        dragDirectionLock
                        onPointerDown={(e) => {
                          xStart.current = e.clientX;
                          yStart.current = e.clientY;
                        }}
                        onPointerMove={(e) => {
                          if (xLock.current || yLock.current) return;
                          const dx = Math.abs(xStart.current - e.clientX);
                          const dy = Math.abs(yStart.current - e.clientY);
                          if (dx > dy && dx > 10) {
                            xControls.start(e);
                            xLock.current = true;
                          } else if (dy > dx && dy > 10) {
                            yControls.start(e);
                            yLock.current = true;
                          }
                        }}
                        onPointerLeave={() => {
                          xLock.current = false;
                          yLock.current = false;
                          xStart.current = 0;
                          yStart.current = 0;
                        }}
                        transition={{ type: "tween" }}
                        className="absolute inset-0 bg-white dark:bg-[#212121] z-20 touch-pan-right"
                      >
                        <MainChat yControls={yControls} />
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                )}
                <MainContentMessanger
                  setIsScroll={setIsScroll}
                  refContainer={mainContainerChats}
                  targetRef={targetRef}
                />
              </>
            )}
          </div>
          {width < 1024 && <FooterMobileMessanger />}
        </div>
        {width >= 1024 && (
          <div
            className={`relative w-2/3 flex overflow-clip ${!loginChat && !chatId && "justify-center items-center"}`}
          >
            {loginChat && chatId && width !== 0 ? (
              <MainChat yControls={yControls} />
            ) : (
              <p className="font-medium text-neutral-800 dark:text-neutral-200 bg-white dark:bg-[#212121] py-1.25 px-2.5 rounded-full text-sm select-none">
                Выберите кому хотите написать
              </p>
            )}
          </div>
        )}
        <AnimatePresence>
          {openedContextMenu && width >= 1024 && <ContextMenu />}
        </AnimatePresence>
        {isOpenPanel && width >= 1024 && <PanelAdvancedTimeForMessage />}
      </div>
    </div>
  );
}
