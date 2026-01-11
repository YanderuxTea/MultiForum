import Link from "next/link";
import AvatarUser from "../users/AvatarUser";
import { ILastStatuses } from "./BlockAdditionalInformation";
import ColorNicknameUser from "../users/ColorNicknameUser";
import ClockIcon from "../icons/ClockIcon";
import useTimeAgo from "@/hooks/useTimeAgo";

export default function StatusCard({ props }: { props: ILastStatuses }) {
  return (
    <div className="p-2.5 flex flex-row gap-2.5 items-start">
      <div className="shrink-0 pt-2">
        <AvatarUser
          props={{
            role: props.user.role,
            avatar: props.user.avatar ?? undefined,
            width: 32,
            height: 32,
          }}
        />
      </div>
      <div className="flex flex-col gap-1.25 text-left">
        <Link href={`/profile/${props.user.login}`}>
          <ColorNicknameUser
            user={{ role: props.user.role, login: props.user.login }}
            fontSize={16}
            fontWeight={600}
          />
        </Link>
        <p className="text-neutral-800 dark:text-neutral-200 text-sm font-medium break break-all">
          {props.text}
        </p>
        <div className="flex flex-row gap-1.25 items-center">
          <ClockIcon />
          <p className="text-sm font-medium">{useTimeAgo(props.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
