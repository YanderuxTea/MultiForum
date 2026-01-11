import {
  IProfileActivity,
  IProfileActivityUser,
} from "@/app/api/getActivityProfile/route";
import MessageCardUser from "./MessageCardUser";
import StatusCardUser from "./StatusCardUser";
import ReactionCardUser from "./ReactionCardUser";
export default function ActivityCardUser({
  props,
  login,
  role,
  avatar,
  setProfileActivity,
}: {
  props: IProfileActivityUser;
  login: string;
  role: string;
  avatar: string | null;
  setProfileActivity: React.Dispatch<
    React.SetStateAction<IProfileActivity | null>
  >;
}) {
  return props.activityType === "message" ? (
    <MessageCardUser
      props={props.mess!}
      key={props.id}
      role={role}
      login={login}
      avatar={avatar}
    />
  ) : props.activityType === "reaction" ? (
    <ReactionCardUser key={props.id} props={props.reaction!} />
  ) : (
    <StatusCardUser
      idActivity={props.id}
      setProfileActivity={setProfileActivity}
      key={props.id}
      props={props.status!}
      role={role}
      login={login}
      avatar={avatar}
    />
  );
}
