import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import ExitIcon from "../icons/ExitIcon";

export default function SearchMessanger({
  query,
  setQuery,
  isActiveSearch,
  setIsActiveSearch,
  targetSearchInputRef,
  refSearch,
}: {
  refSearch: React.RefObject<HTMLInputElement | null>;
  targetSearchInputRef: (node: HTMLInputElement | null) => void;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  isActiveSearch: boolean;
  setIsActiveSearch: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <motion.div
      layout
      key={"searchContainer"}
      initial={{ y: "-100%" }}
      animate={{ y: "0" }}
      exit={{ y: "-100%" }}
      transition={{ type: "tween" }}
      className="absolute p-2.5 border-b border-neutral-300 dark:border-neutral-700 overflow-clip w-full bg-white dark:bg-[#212121] flex flex-row lg:rounded-t-md z-3 cursor-text"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={"inputSearchChats"}
          layout
          className={`bg-white dark:bg-[#212121] z-2 border grow rounded-full relative flex flex-row items-center border-neutral-300 dark:border-neutral-700 has-focus:border-neutral-400 dark:has-focus:border-neutral-600 transition-colors duration-300 ease-out ${isActiveSearch ? "justify-start" : "justify-center"}`}
          onClick={() => refSearch.current?.focus()}
        >
          <div className="flex flex-row w-full items-center overflow-clip">
            <motion.input
              layout="position"
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setQuery("");
                  setIsActiveSearch(false);
                  refSearch.current?.blur();
                }
              }}
              ref={targetSearchInputRef}
              type="text"
              value={query}
              autoComplete="off"
              inputMode="search"
              enterKeyHint="search"
              onChange={(e) => setQuery(e.target.value.trim())}
              maxLength={25}
              onFocus={() => setIsActiveSearch(true)}
              id="searchUsersMessanger"
              className="px-2.5 py-1.25 outline-none peer w-full"
            />
            <AnimatePresence>
              {query.length > 0 && (
                <motion.button
                  initial={{ x: 50, scale: 0 }}
                  animate={{ x: 0, scale: 1 }}
                  exit={{ x: 50, scale: 0 }}
                  transition={{ type: "spring", duration: 0.7 }}
                  onClick={() => setQuery("")}
                  className="shrink-0 flex items-center justify-center w-6 h-6 bg-neutral-300 dark:bg-neutral-700 rounded-full font-medium mx-2.5 text-white cursor-pointer transition-colors duration-300 ease-out hover:bg-neutral-400 dark:hover:bg-neutral-600 select-none"
                >
                  X
                </motion.button>
              )}
            </AnimatePresence>
          </div>
          {query.trim().length === 0 && (
            <motion.p
              layout="position"
              className="absolute text-neutral-500 dark:text-neutral-400 pl-2.5 font-medium select-none"
            >
              Поиск
            </motion.p>
          )}
        </motion.div>
        {isActiveSearch && (
          <motion.button
            key={"buttonCloseSearch"}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => {
              setIsActiveSearch(false);
              setQuery("");
            }}
            className="p-1.25  flex items-center justify-center border rounded-full shrink-0 border-neutral-300 dark:border-neutral-700 ml-2.5 cursor-pointer"
          >
            <ExitIcon />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
