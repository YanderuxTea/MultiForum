"use client";
import useSocket from "@/hooks/useSocket";
import React, { useEffect } from "react";
async function getLastSeen(login: string) {
  const req = await fetch("/api/getOnline", {
    method: "POST",
    headers: { "Content-Type": "json/application" },
    body: JSON.stringify({ login: login }),
  });
  const res = await req.json();
  if (res.ok) {
    return res.lastSeen;
  } else {
    return null;
  }
}
export default function CheckProfileOnline({ login }: { login: string }) {
  const onlineList = useSocket().onlineList;
  const isOnline = onlineList.some((val) => val.login === login);
  const [lastSeen, setLastSeen] = React.useState<string>("Загрузка");
  useEffect(() => {
    if (!isOnline) {
      setLastSeen("Загрузка");
      setTimeout(async () => {
        if (!isOnline) {
          const res = await getLastSeen(login);
          if (res) {
            const convertedDate = Intl.DateTimeFormat("ru-RU", {
              day: "2-digit",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(res.lastSeen));
            setLastSeen(convertedDate);
          } else {
            setLastSeen("Неизвестно");
          }
        } else {
          return;
        }
      }, 3100);
    }
  }, [onlineList, isOnline, login]);
  return isOnline ? (
    <div className="flex flex-row items-center relative font-medium text-neutral-800 dark:text-neutral-200">
      Онлайн{" "}
      <div className="w-3 aspect-square bg-green-500 rounded-full animate-pulse absolute left-0 -translate-x-4.5"></div>
    </div>
  ) : (
    <p className="text-neutral-600 dark:text-neutral-400 font-medium">
      Был в сети: {lastSeen}
    </p>
  );
}
