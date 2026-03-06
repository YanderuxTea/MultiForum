import { motion, useMotionValue, useMotionValueEvent } from "framer-motion";
import CardFoundUser from "./CardFoundUser";
import React, { useEffect } from "react";
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
      className="absolute bg-neutral-100 dark:bg-[#1a1a1a] inset-0 mt-27.5 lg:mt-14.25 overflow-y-auto divide-y divide-neutral-300 dark:divide-neutral-700 z-2"
    >
      {debounceQuery.length === 0 ? (
        <p className="text-center font-medium text-neutral-800 dark:text-neutral-200 my-2.5 select-none">
          Начните вводить в поиск
        </p>
      ) : chats.length > 0 ? (
        chats.map((val, index) => {
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
        })
      ) : (
        <p className="text-center font-medium text-neutral-800 dark:text-neutral-200 my-2.5 select-none">
          Пользователи не найдены
        </p>
      )}
    </motion.div>
  );
}
