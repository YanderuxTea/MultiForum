import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import CardFoundUser from "./CardFoundUser";
import React, { useEffect, useState } from "react";
import useCurrentWidth from "@/hooks/useCurrentWidth";
import useObserver from "@/hooks/useObserver";
import useDebounce from "@/hooks/useDebounce";
import { foundUsers } from "@/components/ui/messanger/actions";

export interface ISearchChats {
  id: string;
  login: string;
  role: string;
  avatar: string | null;
  Chats: {
    id: string;
    _count: {
      MessagesChats: number;
    };
  }[];
}
export default function SearchContent({
  setQuery,
  setIsActiveSearch,
  refSearch,
  query,
}: {
  query: string;
  refSearch: React.RefObject<HTMLInputElement | null>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsActiveSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const containerChats = React.useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const width = useCurrentWidth();
  const { isVisible, targetRef } = useObserver({
    container: containerChats,
    margin: 200,
  });
  const [hasMore, setHasMore] = React.useState<boolean>(true);
  const [chats, setChats] = React.useState<ISearchChats[]>([]);
  const [cursor, setCursor] = React.useState<string>("");
  const debounceQuery = useDebounce(query, 500);
  const [loading, setLoading] = React.useTransition();
  const newSearchFetch = React.useCallback(async () => {
    if (debounceQuery.length > 25) return;
    setLoading(async () => {
      const res = await foundUsers("", debounceQuery);
      if (res.ok && res.users) {
        setChats(res.users);
        setCursor(res.cursor);
        setHasMore(res.hasMore);
      }
    });
  }, [debounceQuery]);
  const loadMoreSearch = React.useCallback(async () => {
    if (!hasMore || loading || !isVisible || debounceQuery.length > 25) return;
    setLoading(async () => {
      const res = await foundUsers(cursor, debounceQuery);
      if (res.ok && res.users) {
        setChats((prev) => [...prev, ...res.users]);
        setCursor(res.cursor);
        setHasMore(res.hasMore);
      }
    });
  }, [cursor, debounceQuery, hasMore, isVisible, loading]);
  useEffect(() => {
    if (debounceQuery.length > 0) {
      newSearchFetch();
    } else {
      setChats([]);
      setCursor("");
      setHasMore(true);
    }
  }, [debounceQuery]);
  useEffect(() => {
    if (isVisible) {
      loadMoreSearch();
    }
  }, [isVisible]);
  useMotionValueEvent(x, "change", (latest) => {
    if (latest < 0) {
      x.set(0);
    }
  });
  useEffect(() => {
    function scrollToTop() {
      window.scrollTo(0, 0);
    }
    if (width < 1024) {
      window.addEventListener("scroll", scrollToTop);
    } else {
      window.removeEventListener("scroll", scrollToTop);
    }
    return () => {
      window.removeEventListener("scroll", scrollToTop);
    };
  }, [width]);
  const [activeChats, setActiveChats] = useState<ISearchChats[]>([]);
  const [newChats, setNewChats] = useState<ISearchChats[]>([]);
  useEffect(() => {
    const activeChats = chats.filter((chat) => chat.Chats.length !== 0);
    const newChats = chats.filter((chat) => chat.Chats.length === 0);
    setActiveChats(activeChats);
    setNewChats(newChats);
  }, [chats]);
  return (
    <motion.div
      ref={containerChats}
      drag={width >= 1024 ? undefined : "x"}
      dragElastic={1}
      style={{ x }}
      dragConstraints={{ left: 0, right: 0 }}
      initial={{ x: "100%" }}
      animate={{ x: "0%" }}
      exit={{ x: "100%" }}
      dragDirectionLock={true}
      transition={{ type: "tween" }}
      onDragEnd={(e, info) => {
        if (info.offset.x >= width / 10) {
          setQuery("");
          setIsActiveSearch(false);
          refSearch.current?.blur();
        }
      }}
      className="absolute bg-neutral-100 dark:bg-[#1a1a1a] inset-0 mt-27.5 lg:mt-14.25 overflow-y-auto flex flex-col z-2"
    >
      {debounceQuery.length === 0 ? (
        <p className="text-center font-medium text-neutral-800 dark:text-neutral-200 my-2.5 select-none">
          Начните вводить в поиск
        </p>
      ) : chats.length > 0 ? (
        <>
          {activeChats.length > 0 && (
            <div
              className={
                "flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700"
              }
            >
              <p
                className={
                  "px-2.5 py-1.25 text-neutral-800 dark:text-neutral-200 font-medium"
                }
              >
                Активные чаты
              </p>
              {activeChats.map((val, index) => {
                const isLast = index === chats.length - 1;
                return (
                  <CardFoundUser
                    refSearch={refSearch}
                    setIsActiveSearch={setIsActiveSearch}
                    setQuery={setQuery}
                    targetRef={isLast ? targetRef : undefined}
                    key={val.id}
                    props={val}
                  />
                );
              })}
            </div>
          )}
          {newChats.length > 0 && (
            <div
              className={
                "flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700"
              }
            >
              <p
                className={
                  "px-2.5 py-1.25 text-neutral-800 dark:text-neutral-200 font-medium"
                }
              >
                Новые пользователи
              </p>
              {newChats.map((val, index) => {
                const isLast = index === chats.length - 1;
                return (
                  <CardFoundUser
                    refSearch={refSearch}
                    setIsActiveSearch={setIsActiveSearch}
                    setQuery={setQuery}
                    targetRef={isLast ? targetRef : undefined}
                    key={val.id}
                    props={val}
                  />
                );
              })}
            </div>
          )}
        </>
      ) : (
        <p className="text-center font-medium text-neutral-800 dark:text-neutral-200 my-2.5 select-none">
          Пользователи не найдены
        </p>
      )}
    </motion.div>
  );
}
