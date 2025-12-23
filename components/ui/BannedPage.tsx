"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

export default function BannedPage() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");
  const time = searchParams.get("time");
  const banEnd = searchParams.get("banEnd");
  const admin = searchParams.get("admin");
  const [timerEnd, setTimerEnd] = React.useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimerEnd(Math.floor((Number(banEnd) - Date.now()) / 1000));
    }, 1000);
    if (Number(time) === 0) {
      clearInterval(interval);
      setTimerEnd(0);
    } else {
      setTimerEnd(Math.floor((Number(banEnd) - Date.now()) / 1000));
    }
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative min-h-screen px-2.5 items-center justify-center flex w-full">
      <AnimatePresence mode="wait">
        {timerEnd >= 0 ? (
          <motion.div
            key="ban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="relative z-1 flex flex-col gap-2.5 p-2.5 bg-white dark:bg-[#212121] border border-neutral-300 dark:border-neutral-700 rounded-md justify-center items-center lg:p-10 lg:px-20"
          >
            <p className="text-lg text-neutral-800 dark:text-neutral-200 font-bold w-full text-center">
              Вы заблокированы
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium w-full text-center">
              Вас заблокировал:{" "}
              <span className="font-bold text-red-600 dark:text-red-700">
                {admin}
              </span>
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium w-full text-center">
              Причина блокировки: <br />
              <span className="text-red-600 dark:text-red-700 underline underline-offset-4">
                {reason}
              </span>
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium w-full text-center">
              Время блокировки:{" "}
              <span className="text-red-600 dark:text-red-700">
                {Number(time) === 0 ? "Навсегда" : time}{" "}
                {Number(time) !== 0 && "минут"}
              </span>
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 font-medium w-full text-center">
              Окончание блокировки через: <br />{" "}
              <span className="text-red-600 dark:text-red-700">
                {Number(time) === 0
                  ? "Никогда"
                  : `${Math.floor(timerEnd / 3600)
                      .toString()
                      .padStart(2, "0")}:${Math.floor((timerEnd % 3600) / 60)
                      .toString()
                      .padStart(2, "0")}:${(timerEnd % 60)
                      .toString()
                      .padStart(2, "0")}`}
              </span>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="unban"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-1 p-2.5 flex flex-col rounded-md bg-white dark:bg-[#212121] gap-2.5 border border-neutral-300 dark:border-neutral-700 justify-center items-center lg:p-10 lg:px-20"
          >
            <p className="text-green-500 dark:text-green-600 font-bold w-full text-center text-lg">
              Вы разблокированы
            </p>
            <p className="text-neutral-800 dark:text-neutral-200 font-medium">
              Не нарушайте больше правила :)
            </p>
            <Link
              href={"/"}
              className="bg-green-500 dark:bg-green-600 rounded-md py-1.25 text-center text-white font-medium hover:bg-green-400 dark:hover:bg-green-500 active:bg-green-600 dark:active:bg-green-700 transition-colors duration-300 ease-out px-2.5"
            >
              Вернуться на главную
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {timerEnd >= 0 ? (
          <motion.div
            key="red"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-linear-to-t"
            style={{
              background:
                "linear-gradient(#E7000B 1%, transparent 15%, transparent 98%, #E7000B 105%)",
            }}
          ></motion.div>
        ) : (
          <motion.div
            key="green"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-linear-to-t"
            style={{
              background:
                "linear-gradient(#00A63E 1%, transparent 15%, transparent 98%, #00A63E 105%)",
            }}
          ></motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
