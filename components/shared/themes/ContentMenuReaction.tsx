"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import ArrowReaction from "../icons/ArrowReaction";
import HeartReaction from "../icons/HeartReaction";
import React from "react";
import ReactionCard from "./ReactionCard";
import Pagination from "../Pagination";
import { ReactionType } from "@/context/CategoriesContext";

export interface IKeyPropsReaction {
  login: string;
  avatar: string | null;
  id: string;
  role: string;
  createdAt: Date;
  reactionType: ReactionType;
}
interface IProps {
  up: IKeyPropsReaction[];
  down: IKeyPropsReaction[];
  like: IKeyPropsReaction[];
}
export default function ContentMenuReaction({ props }: { props: IProps }) {
  const buttonsSorted = [
    { title: "Все", sort: "all", icon: null },
    {
      title: "Понравилось",
      sort: "like",
      icon: <HeartReaction />,
      color: "bg-[#F76700] dark:bg-[#FF6524]",
    },
    {
      title: "Топ",
      sort: "up",
      icon: <ArrowReaction />,
      color: "bg-[#289E67] dark:bg-[#008849]",
    },
    {
      title: "Дно",
      sort: "down",
      icon: <ArrowReaction />,
      color: "bg-[#EB4848] dark:bg-[#E02E2E]",
    },
  ];
  const allReactions = [...props.up, ...props.down, ...props.like].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const sorted = searchParams.get("sort");
  const [pageNumber, setPageNumber] = React.useState<number>(0);
  function changeSort(params: string) {
    const search = new URLSearchParams(searchParams.toString());
    search.set("sort", params);
    router.push(`${pathname}?${search.toString()}`, { scroll: false });
  }
  const totalPages = React.useMemo(() => {
    if (sorted === "all") {
      return Math.ceil(allReactions.length / 10);
    } else if (sorted === "like" || sorted === "down" || sorted === "up") {
      return Math.ceil(props[sorted].length / 10);
    } else {
      return 0;
    }
  }, [sorted]);

  const arrayReactions =
    sorted === "like" || sorted === "down" || sorted === "up"
      ? props[sorted]
      : sorted === "all"
      ? allReactions
      : null;
  const pageReaction =
    sorted === "up" || sorted === "like" || sorted === "down"
      ? props[sorted].slice(pageNumber * 10, pageNumber * 10 + 10)
      : sorted === "all"
      ? arrayReactions?.slice(pageNumber * 10, pageNumber * 10 + 10)
      : null;

  return (
    <div className="pt-2.5 flex flex-col gap-1.25">
      <div className="grid grid-cols-4">
        {buttonsSorted.map((button) => {
          return (
            <div
              key={button.sort}
              className={`flex transition-colors duration-300 ease-out items-center justify-center cursor-pointer border p-1.25 border-neutral-300 dark:border-neutral-700 rounded-t-md font-medium ${
                button.sort === sorted &&
                " bg-neutral-200/50 dark:bg-neutral-700"
              }`}
              onClick={() => changeSort(button.sort)}
            >
              <button
                className={`${
                  button.sort === "up" && "rotate-180"
                } cursor-pointer ${
                  button.sort !== "all" &&
                  `${button.color} max-w-max p-1.25 rounded-full`
                }`}
              >
                {button.icon ?? button.title}
              </button>
            </div>
          );
        })}
      </div>
      <div
        className={`${
          pageReaction && pageReaction.length > 0
            ? "grid grid-cols-2 grid-rows-5 grid-flow-col"
            : "flex justify-center"
        } gap-1.25`}
      >
        {pageReaction && pageReaction.length > 0 ? (
          pageReaction.map((reaction) => {
            return <ReactionCard key={reaction.id} props={reaction} />;
          })
        ) : (
          <p className="text-neutral-700 dark:text-neutral-300">
            Таких реакций нет
          </p>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination
          totalPages={totalPages}
          count={
            sorted === "like" || sorted === "down" || sorted === "up"
              ? props[sorted].length
              : sorted === "all"
              ? arrayReactions?.length ?? 0
              : 0
          }
          pageNumber={pageNumber}
          setPageNumber={setPageNumber}
        />
      )}
    </div>
  );
}
