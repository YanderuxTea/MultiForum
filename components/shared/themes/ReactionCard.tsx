import Link from "next/link";
import AvatarUser from "../users/AvatarUser";
import ColorNicknameUser from "../users/ColorNicknameUser";
import { IKeyPropsReaction } from "./ContentMenuReaction";
import ArrowReaction from "../icons/ArrowReaction";
import HeartReaction from "../icons/HeartReaction";

export default function ReactionCard({ props }: { props: IKeyPropsReaction }) {
  const reactionIcon =
    props.reactionType === "down" || props.reactionType === "up" ? (
      <ArrowReaction />
    ) : (
      <HeartReaction />
    );
  const convertedDate = Intl.DateTimeFormat("ru-RU", {
    hour: "numeric",
    minute: "numeric",
    day: "numeric",
    month: "long",
  }).format(new Date(props.createdAt));
  const color =
    props.reactionType === "down"
      ? "bg-[#EB4848] dark:bg-[#E02E2E]"
      : props.reactionType === "like"
      ? "bg-[#F76700] dark:bg-[#FF6524]"
      : "bg-[#289E67] dark:bg-[#008849] rotate-180";
  return (
    <div className="flex flex-col">
      <div className="border rounded-md p-1.25 border-neutral-300 dark:border-neutral-700 flex flex-row items-center gap-1.25 justify-between">
        <AvatarUser
          props={{
            role: props.role,
            avatar: props.avatar ?? undefined,
            width: 32,
            height: 32,
          }}
        />
        <Link href={`/profile/${props.login}`} className="truncate w-full">
          <ColorNicknameUser
            user={{ role: props.role, login: props.login }}
            fontSize={14}
            fontWeight={600}
          />
        </Link>
        <span className={`${color} p-0.5 rounded-full`}>{reactionIcon}</span>
      </div>
      <p className="text-neutral-600 dark:text-neutral-400 text-center font-medium text-sm">
        {convertedDate}
      </p>
    </div>
  );
}
