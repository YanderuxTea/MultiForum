import { motion } from "framer-motion";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Virtuoso } from "react-virtuoso";
import HeaderNotifyCenter from "@/components/shared/notifys/HeaderNotifyCenter.tsx";
import useNotify from "@/hooks/useNotify.ts";
import useDataUser from "@/hooks/useDataUser.ts";
import {
  getNotifications,
  markAllNotifications,
  refreshNotifications,
} from "@/components/ui/headers/actions.ts";
import CardNotifyCenter from "@/components/shared/notifys/CardNotifyCenter.tsx";

export default function NotifyCenterMobile({
  setIsOpenNotifyCenter,
}: {
  setIsOpenNotifyCenter: Dispatch<SetStateAction<boolean>>;
}) {
  useEffect(() => {
    window.document.body.style.overflow = "hidden";
    return () => {
      window.document.body.style.overflow = "unset";
    };
  }, []);
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
      key={"backgroundNotifyCenterMobile"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={() => setIsOpenNotifyCenter(false)}
      className={"fixed bg-black/25 z-500 inset-0 flex items-end"}
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: "0%" }}
        exit={{ y: "100%" }}
        transition={{ type: "tween", duration: 0.2 }}
        key={"containerNotifyCenterMobile"}
        className={
          "bg-white dark:bg-neutral-800 w-full h-4/5 flex flex-col rounded-t-3xl"
        }
        onClick={(e) => e.stopPropagation()}
      >
        <HeaderNotifyCenter />
        {notifications.length > 0 ? (
          <Virtuoso
            data={notifications}
            style={{ height: "100%" }}
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
    </motion.div>
  );
}
