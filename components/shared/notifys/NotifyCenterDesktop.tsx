import { motion } from "framer-motion";
import { Virtuoso } from "react-virtuoso";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import HeaderNotifyCenter from "@/components/shared/notifys/HeaderNotifyCenter.tsx";
import useNotify from "@/hooks/useNotify.ts";
import CardNotifyCenter from "@/components/shared/notifys/CardNotifyCenter.tsx";
import {
  getNotifications,
  markAllNotifications,
  refreshNotifications,
} from "@/components/ui/headers/actions.ts";
import useDataUser from "@/hooks/useDataUser.ts";

export default function NotifyCenterDesktop() {
  const { notifications, setNotifications, countNotifications } = useNotify();
  const [cursor, setCursor] = useState<string>("");
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const userData = useDataUser();
  const block = useRef<boolean>(false);
  function isReached() {
    setIsVisible(true);
  }
  useEffect(() => {
    if (notifications.length === 0) return;
    async function loadMoreNotifications() {
      if (hasMore && userData && !block.current) {
        block.current = true;
        await refreshNotifications(userData.login);
        const newNotify = await getNotifications(
          userData.login,
          cursor,
          notifications,
        );
        if (newNotify) {
          setNotifications(
            Array.from(
              new Map(
                newNotify.fullNotify.map((n) => [n.idNotify, n]),
              ).values(),
            ),
          );
          setCursor(newNotify.nextCursor || "");
          setHasMore(newNotify.hasMore);
        }
        block.current = false;
      }
    }
    loadMoreNotifications();
  }, [hasMore, isVisible, notifications]);
  const actualCount = useRef<number>(0);

  useEffect(() => {
    actualCount.current = countNotifications;
  }, [countNotifications]);
  useEffect(() => {
    return () => {
      markAllNotifications(actualCount.current);
    };
  }, []);
  useEffect(() => {
    if (notifications.length > 0 || actualCount.current === 0) return;
    async function loadNotifications() {
      block.current = true;
      const newNotify = await getNotifications(
        userData?.login,
        cursor,
        notifications,
      );
      if (newNotify) {
        setNotifications(
          Array.from(
            new Map(newNotify.fullNotify.map((n) => [n.idNotify, n])).values(),
          ),
        );

        setCursor(newNotify.nextCursor || "");
        setHasMore(newNotify.hasMore);
        block.current = false;
      }
    }
    loadNotifications();
  }, [notifications]);
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
  const timeFormatterForNotifyCard = useCallback(
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
      initial={{ opacity: 0, height: 0 }}
      animate={{
        opacity: 1,
        height: 550,
      }}
      exit={{ opacity: 0 }}
      className={
        "absolute bg-white dark:bg-[#212121] border-x border-b rounded-b-lg border-neutral-300" +
        ` dark:border-neutral-700 right-0 top-11.25 overflow-hidden w-95 translate-x-1/2 flex flex-col "`
      }
    >
      <HeaderNotifyCenter />
      {notifications.length > 0 ? (
        <Virtuoso
          data={notifications}
          style={{ height: 500 }}
          endReached={isReached}
          itemContent={(index, data) => (
            <CardNotifyCenter
              timeFormatter={timeFormatterForNotifyCard}
              props={data}
              isFirst={index === 0}
            />
          )}
        />
      ) : (
        <div className={"flex flex-1 items-center justify-center"}>
          <p
            className={
              "text-center text-neutral-800 dark:text-neutral-200 text-lg"
            }
          >
            Уведомлений нет
          </p>
        </div>
      )}
    </motion.div>
  );
}
