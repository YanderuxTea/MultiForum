import React, { useEffect, useRef } from "react";
import { filterType } from "./BlockActivityUser";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
export default function BlockFilterActivity({
  filter,
  setFilter,
}: {
  filter: filterType;
  setFilter: React.Dispatch<React.SetStateAction<filterType>>;
}) {
  const [openFilter, setOpenFilter] = React.useState<boolean>(false);
  function chageFilter(filterSet: filterType) {
    if (filterSet === filter) {
      setOpenFilter(false);
    } else {
      setFilter(filterSet);
      setOpenFilter(false);
    }
  }
  const refContainer = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClose(e: MouseEvent | TouchEvent) {
      if (!refContainer.current?.contains(e.target as Node)) {
        setOpenFilter(false);
      }
    }
    window.addEventListener("click", handleClose);
    return () => window.removeEventListener("click", handleClose);
  }, []);
  return (
    <div
      ref={refContainer}
      className={`relative border border-neutral-800 dark:border-neutral-700 rounded-md transition-colors duration-300 ease-out cursor-pointer ${
        openFilter && "bg-neutral-700 dark:bg-neutral-600"
      }`}
    >
      <p
        onClick={() => setOpenFilter((prev) => !prev)}
        className={`p-1.25 cursor-pointer transition-colors duration-300 ease-out select-none uppercase text-[10px] font-bold dark:text-neutral-200 ${
          openFilter ? "text-neutral-100" : "text-neutral-700 "
        }`}
      >
        Сортировка
      </p>
      <AnimatePresence>
        {openFilter && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="border border-neutral-300 dark:border-neutral-700 flex flex-col absolute bg-white dark:bg-neutral-800 rounded-md translate-y-3 w-[250%] right-0 2xl:-left-[75%] before:w-4 before:aspect-square before:absolute before:rotate-45 before:-translate-y-2.25 before:-translate-x-1/2 before:left-9/10 2xl:before:left-1/2 before:bg-white dark:before:bg-neutral-800 before:border-t before:border-l before:border-neutral-300 dark:before:border-neutral-700 z-1"
          >
            <button
              onClick={() => chageFilter("all")}
              className={`text-left py-2.5 cursor-pointer font-bold text-sm px-6 transition-colors duration-300 ease-out text-neutral-700 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-t-sm z-1 ${
                filter === "all" &&
                "before:absolute before:w-2 before:aspect-square before:bg-orange-500 dark:before:bg-orange-600 relative before:translate-y-1.5 before:-translate-x-3.75 before:rounded-full"
              }`}
            >
              Все
            </button>
            <button
              onClick={() => chageFilter("statuses")}
              className={`text-left py-2.5 cursor-pointer font-bold text-sm px-6 transition-colors duration-300 ease-out text-neutral-700 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 z-1 ${
                filter === "statuses" &&
                "before:absolute before:w-2 before:aspect-square before:bg-orange-500 dark:before:bg-orange-600 relative before:translate-y-1.5 before:-translate-x-3.75 before:rounded-full"
              }`}
            >
              Статусы
            </button>
            <button
              onClick={() => chageFilter("messages")}
              className={`text-left py-2.5 cursor-pointer font-bold text-sm px-6 transition-colors duration-300 ease-out text-neutral-700 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-b-sm z-1 ${
                filter === "messages" &&
                "before:absolute before:w-2 before:aspect-square before:bg-orange-500 dark:before:bg-orange-600 relative before:translate-y-1.5 before:-translate-x-3.75 before:rounded-full"
              }`}
            >
              Сообщения
            </button>
            <button
              onClick={() => chageFilter("reactions")}
              className={`text-left py-2.5 cursor-pointer font-bold text-sm px-6 transition-colors duration-300 ease-out text-neutral-700 dark:text-neutral-300 hover:text-neutral-800 dark:hover:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-b-sm z-1 ${
                filter === "reactions" &&
                "before:absolute before:w-2 before:aspect-square before:bg-orange-500 dark:before:bg-orange-600 relative before:translate-y-1.5 before:-translate-x-3.75 before:rounded-full"
              }`}
            >
              Реакции
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
