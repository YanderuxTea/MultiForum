"use client";
import RankIconChecker from "@/components/ui/profiles/RankIconChecker";
import useSocket from "@/hooks/useSocket";
import nullAvatar from "@/public/svg/user.svg";
import Image from "next/image";
interface IAvatarProps {
  avatar?: string;
  role: string;
  width: number;
  height: number;
}
export default function AvatarUser({
  props,
  countMessage,
  onlineCheck,
  login,
}: {
  login?: string;
  onlineCheck?: boolean;
  props: IAvatarProps;
  countMessage?: number;
}) {
  const avatar = props.avatar ? props.avatar : nullAvatar;
  const isGif = props.avatar
    ? props.avatar.toLowerCase().endsWith(".gif")
    : false;
  const onlineList = useSocket().onlineList;
  return (
    <div className="relative shrink-0">
      <Image
        src={avatar}
        draggable={false}
        unoptimized={isGif}
        priority
        alt="Profile avatar"
        width={props.width}
        height={props.height}
        className={`aspect-square border-2 ${
          props.role === "Admin"
            ? "border-red-600"
            : props.role === "Moderator"
              ? "border-blue-700"
              : "border-gray-500"
        } rounded-full ${onlineCheck && "mask-[url(/svg/small_mask.svg)] lg:mask-[url(/svg/big_mask.svg)] mask-no-repeat"} bg-white`}
        style={{ width: props.width, height: props.height }}
      />
      {countMessage && (
        <div className="absolute -translate-x-2 -translate-y-4 lg:translate-x-0  lg:-translate-y-5 w-6 aspect-square lg:scale-170">
          <RankIconChecker countMessage={countMessage} />
        </div>
      )}
      {onlineCheck && (
        <div className="absolute top-0 right-0 w-3 lg:w-6 aspect-square rounded-full flex justify-center items-center">
          <div
            className={`w-2 lg:w-4 aspect-square rounded-full ${onlineList.some((user) => user.login === login) ? "bg-green-500 animate-pulse" : "bg-neutral-300 dark:bg-neutral-600"} `}
          ></div>
        </div>
      )}
    </div>
  );
}
