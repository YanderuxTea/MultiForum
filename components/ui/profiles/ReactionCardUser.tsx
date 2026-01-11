"use client";
import { IProfileReaction } from "@/app/api/getActivityProfile/route";
import ArrowReaction from "@/components/shared/icons/ArrowReaction";
import ClockIcon from "@/components/shared/icons/ClockIcon";
import HeartReaction from "@/components/shared/icons/HeartReaction";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ReactionCardUser({
  props,
}: {
  props: IProfileReaction;
}) {
  const reactionIcon =
    props.reactionType === "down" || props.reactionType === "up" ? (
      <ArrowReaction />
    ) : (
      <HeartReaction />
    );
  const color =
    props.reactionType === "down"
      ? "bg-[#EB4848] dark:bg-[#E02E2E]"
      : props.reactionType === "like"
      ? "bg-[#F76700] dark:bg-[#FF6524]"
      : "rotate-180 bg-[#289E67] dark:bg-[#008849]";
  const params = useParams();
  const isFromUser = props.fromUser.login === params.login;
  const convertedDate = Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(props.createdAt));
  return (
    <div className="p-2.5 flex  flex-row gap-2.5 items-center">
      <div className={`${color} p-1.25 rounded-full max-w-max`}>
        {reactionIcon}
      </div>
      <span className="block text-neutral-600 dark:text-neutral-400 text-sm font-medium break break-all">
        {isFromUser ? (
          <span className="text-neutral-700 dark:text-neutral-300">
            {props.fromUser.login}
          </span>
        ) : (
          <Link
            className="text-neutral-700 dark:text-neutral-300 transition-colors duration-300 ease-out hover:text-blue-500 dark:hover:text-blue-600"
            href={`/profile/${props.fromUser.login}`}
          >
            {props.fromUser.login}
          </Link>
        )}{" "}
        отреагировал на сообщение{" "}
        {isFromUser ? (
          <Link
            className="text-neutral-700 dark:text-neutral-300 transition-colors duration-300 ease-out hover:text-blue-500 dark:hover:text-blue-600"
            href={`/profile/${props.toUser.login}`}
          >
            {props.toUser.login}
          </Link>
        ) : (
          <span className="text-neutral-700 dark:text-neutral-300">
            {props.toUser.login}
          </span>
        )}{" "}
        в теме:{" "}
        <Link
          className="text-neutral-700 dark:text-neutral-300 transition-colors duration-300 ease-out hover:text-blue-500 dark:hover:text-blue-600"
          href={`/theme/${props.messagesPosts.Posts.title}?themeId=${props.messagesPosts.Posts.id}&subCategoryId=${props.messagesPosts.Posts.SubCategories.id}`}
        >
          {props.messagesPosts.Posts.title}
        </Link>
      </span>
      <div className="w-[20%] justify-end items-end flex text-neutral-600 dark:text-neutral-400 text-sm font-medium text-center lg:text-end">
        <p>{convertedDate}</p>
      </div>
    </div>
  );
}
