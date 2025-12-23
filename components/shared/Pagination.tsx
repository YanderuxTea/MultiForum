import Arrow from "@/components/shared/icons/Arrow";
import React, { useEffect } from "react";
import DoubleArrow from "@/components/shared/icons/DoubleArrow";

export default function Pagination({
  pageNumber,
  setPageNumber,
  totalPages,
  count,
  id,
}: {
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  count: number;
  id?: string;
}) {
  const [numberPageInput, setNumberPageInput] = React.useState<number | string>(
    pageNumber + 1
  );
  function handlePageChange(pageNumber: string) {
    const pageNumberConst = Number(pageNumber);
    if (isNaN(pageNumberConst)) {
      return;
    }
    setNumberPageInput(pageNumber);
  }
  function changePageNumber() {
    const pageNumberConst = Number(numberPageInput);
    if (
      typeof numberPageInput === "string" &&
      numberPageInput.trim().length === 0
    ) {
      setNumberPageInput(pageNumber + 1);
      return;
    }
    const page = Math.min(Math.max(pageNumberConst || 1, 1), totalPages);
    setPageNumber(page - 1);
    setNumberPageInput(page);
  }

  useEffect(() => {
    setNumberPageInput(pageNumber + 1);
  }, [pageNumber]);
  useEffect(() => {
    if ((totalPages === pageNumber && pageNumber > 0) || totalPages === 0) {
      if (totalPages === 0) {
        setPageNumber(0);
        return;
      }
      setPageNumber(totalPages - 1);
    }
  }, [totalPages, pageNumber, setPageNumber]);
  return (
    <div className="flex flex-row justify-between items-center">
      <div className="flex flex-row gap-1.25 items-center">
        <button
          disabled={pageNumber - 1 < 0}
          onClick={() => {
            setPageNumber(0);
          }}
          className="rotate-90 group rounded-md border border-neutral-300 dark:border-neutral-700 disabled:bg-neutral-200 transition-colors duration-300 ease-out cursor-pointer disabled:cursor-no-drop hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-800 dark:disabled:bg-neutral-600"
        >
          <DoubleArrow />
        </button>
        <button
          disabled={pageNumber - 1 < 0}
          onClick={() =>
            pageNumber - 1 >= 0 && setPageNumber((prevState) => prevState - 1)
          }
          className="rotate-90 group rounded-md border border-neutral-300 dark:border-neutral-700 disabled:bg-neutral-200 transition-colors duration-300 ease-out cursor-pointer disabled:cursor-no-drop hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-800 dark:disabled:bg-neutral-600"
        >
          <Arrow />
        </button>
        <input
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              (e.target as HTMLInputElement).blur();
            }
          }}
          id={`paginationInput${id}`}
          type="tel"
          inputMode="numeric"
          disabled={totalPages === 1}
          onFocus={() => {
            setNumberPageInput("");
          }}
          readOnly={totalPages === 1}
          className="w-7.5 text-center select-none outline-none border rounded-md border-neutral-300 dark:border-neutral-700"
          value={numberPageInput}
          onBlur={() => changePageNumber()}
          onChange={(e) => handlePageChange(e.target.value.trim())}
        />
        <button
          disabled={pageNumber + 1 >= totalPages}
          onClick={() =>
            pageNumber + 1 < totalPages &&
            setPageNumber((prevState) => prevState + 1)
          }
          className="-rotate-90 group rounded-md border border-neutral-300 dark:border-neutral-700 disabled:bg-neutral-200 transition-colors duration-300 ease-out cursor-pointer disabled:cursor-no-drop hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-800 dark:disabled:bg-neutral-600"
        >
          <Arrow />
        </button>
        <button
          disabled={pageNumber + 1 >= totalPages}
          onClick={() => setPageNumber(totalPages - 1)}
          className="-rotate-90 group rounded-md border border-neutral-300 dark:border-neutral-700 disabled:bg-neutral-200 transition-colors duration-300 ease-out cursor-pointer disabled:cursor-no-drop hover:bg-neutral-300 active:bg-neutral-400 dark:hover:bg-neutral-700 dark:active:bg-neutral-800 dark:disabled:bg-neutral-600"
        >
          <DoubleArrow />
        </button>
      </div>
      <p className="text-neutral-600 dark:text-neutral-400 font-medium flex flex-col">
        <span>Результатов: {count}</span> <span>Страниц: {totalPages}</span>
      </p>
    </div>
  );
}
