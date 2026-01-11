import RankIconChecker from "@/components/ui/profiles/RankIconChecker";
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
}: {
  props: IAvatarProps;
  countMessage?: number;
}) {
  const avatar = props.avatar ? props.avatar : nullAvatar;
  const isGif = props.avatar
    ? props.avatar.toLowerCase().endsWith(".gif")
    : false;
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
        className={`outline-2 aspect-square rounded-full bg-white ${
          props.role === "Admin"
            ? "outline-red-600"
            : props.role === "Moderator"
            ? "outline-blue-700"
            : "outline-gray-500"
        }`}
        style={{ width: props.width, height: props.height }}
      />
      {countMessage && (
        <div className="absolute -translate-x-2 -translate-y-4 lg:translate-x-0  lg:-translate-y-5 w-6 aspect-square lg:scale-170">
          <RankIconChecker countMessage={countMessage} />
        </div>
      )}
    </div>
  );
}
