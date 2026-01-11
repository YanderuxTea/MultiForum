import ReputationChecker from "@/components/ui/profiles/ReputationChecker";
import AvatarUser from "../users/AvatarUser";
import ColorNicknameUser from "../users/ColorNicknameUser";
import { ITopUsers } from "./InformationTop";
import Link from "next/link";

export default function TopCard({
  props,
  position,
}: {
  props: ITopUsers;
  position: number;
}) {
  return (
    <div className="p-2.5 flex flex-row gap-2.5 justify-between items-center">
      <div className="flex flex-row items-center gap-2.5">
        <p className="font-medium w-3">{position}</p>
        <AvatarUser
          props={{
            role: props.role,
            avatar: props.avatar || undefined,
            width: 32,
            height: 32,
          }}
        />
        <Link href={`/profile/${props.login}`}>
          <ColorNicknameUser
            user={{ role: props.role, login: props.login }}
            fontSize={14}
            fontWeight={600}
          />
        </Link>
      </div>
      <ReputationChecker small={true} reputation={props.reputation} />
    </div>
  );
}
