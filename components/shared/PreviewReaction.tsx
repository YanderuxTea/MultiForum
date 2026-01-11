"use client";

import { useEffect } from "react";
import ArrowReaction from "./icons/ArrowReaction";
import HeartReaction from "./icons/HeartReaction";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function PreviewReaction({
  down,
  like,
  up,
  setIsOpenReactionMenu,
  isOpenReactionMenu,
}: {
  isOpenReactionMenu: boolean;
  setIsOpenReactionMenu: React.Dispatch<React.SetStateAction<boolean>>;
  down: number;
  like: number;
  up: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  function openMenu(params: string) {
    const search = new URLSearchParams(searchParams.toString());
    search.set("sort", params);
    setIsOpenReactionMenu(true);
    router.push(`${pathname}?${search.toString()}`, { scroll: false });
  }
  useEffect(() => {
    if (!isOpenReactionMenu) {
      const search = new URLSearchParams(searchParams.toString());
      search.delete("sort");
      router.push(`${pathname}?${search.toString()}`, { scroll: false });
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpenReactionMenu]);
  return (
    <div className="flex flex-row items-center rounded-full gap-1.25 max-w-max text-neutral-800 dark:text-neutral-200 font-medium text-sm">
      {up > 0 && (
        <span
          className="flex flex-row items-center gap-1.25 border p-1.25 rounded-full border-neutral-300 dark:border-neutral-700 cursor-pointer px-2"
          onClick={() => openMenu("up")}
        >
          <div className="rounded-full rotate-180 bg-[#289E67] dark:bg-[#008849] w-5 h-5 shrink-0 flex items-center justify-center">
            <ArrowReaction />
          </div>
          {up}
        </span>
      )}
      {like > 0 && (
        <span
          className="flex flex-row items-center gap-1.25 border p-1.25 rounded-full border-neutral-300 dark:border-neutral-700 cursor-pointer px-2"
          onClick={() => openMenu("like")}
        >
          <div className="rounded-full bg-[#F76700] dark:bg-[#FF6524] w-5 h-5 shrink-0 flex items-center justify-center">
            <HeartReaction />
          </div>
          {like}
        </span>
      )}
      {down > 0 && (
        <span
          className="flex flex-row items-center gap-1.25 border p-1.25 rounded-full border-neutral-300 dark:border-neutral-700 cursor-pointer px-2"
          onClick={() => openMenu("down")}
        >
          <div className="rounded-full bg-[#EB4848] dark:bg-[#E02E2E] w-5 h-5 shrink-0 flex items-center justify-center">
            <ArrowReaction />
          </div>
          {down}
        </span>
      )}
    </div>
  );
}
