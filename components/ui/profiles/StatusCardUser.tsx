import {
  IProfileActivity,
  IProfileStatus,
} from "@/app/api/getActivityProfile/route";
import DeleteButton from "@/components/shared/buttons/DeleteButton";
import ClockIcon from "@/components/shared/icons/ClockIcon";
import AvatarUser from "@/components/shared/users/AvatarUser";
import ColorNicknameUser from "@/components/shared/users/ColorNicknameUser";
import useDataUser from "@/hooks/useDataUser";
import useNotify from "@/hooks/useNotify";
import useTimeAgo from "@/hooks/useTimeAgo";
import React from "react";

export default function StatusCardUser({
  login,
  role,
  avatar,
  props,
  setProfileActivity,
  idActivity,
}: {
  idActivity: string;
  login: string;
  role: string;
  avatar: string | null;
  props: IProfileStatus;
  setProfileActivity: React.Dispatch<
    React.SetStateAction<IProfileActivity | null>
  >;
}) {
  const userData = useDataUser();
  const [pending, setPending] = React.useTransition();
  const { setIsNotify, setMessage } = useNotify();
  async function deleteStatus() {
    setPending(async () => {
      if (userData?.login !== login && userData?.role !== "Admin") {
        setMessage("Ошибка: недостаточно прав");
        setIsNotify(true);
        return;
      }
      const req = await fetch("/api/deleteStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: props.id, login: login }),
      });
      const res = await req.json();
      if (res.ok) {
        setProfileActivity((prev) => {
          if (!prev || !prev.activityUser) {
            return prev;
          }
          return {
            ...prev,
            activityUser: prev.activityUser.filter(
              (activ) => activ.id !== idActivity
            ),
            _count: { activityUser: prev._count.activityUser - 1 },
          };
        });
      } else {
        setMessage("Ошибка: " + res.error);
        setIsNotify(true);
      }
    });
  }
  return (
    <div className="p-2.5 flex flex-row gap-2.5">
      <div className="flex flex-col gap-5 grow">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-2.5 grow">
            <div className="shrink-0 hidden lg:block">
              <AvatarUser
                props={{
                  role: role,
                  avatar: avatar ?? undefined,
                  width: 40,
                  height: 40,
                }}
              />
            </div>
            <ColorNicknameUser
              user={{ role: role, login: login }}
              fontSize={20}
              fontWeight={600}
            />
          </div>
          {(userData?.login === login || userData?.role === "Admin") && (
            <div className="shrink-0">
              <DeleteButton eventUsers={deleteStatus} pending={pending} />
            </div>
          )}
        </div>
        <p className="text-neutral-800 dark:text-neutral-200 text-sm break-all lg:pl-12.5">
          {props.text}
        </p>
        <div className="flex flex-row items-center gap-1.25 text-sm font-medium text-neutral-600 dark:text-neutral-300 lg:pl-12.5">
          <ClockIcon />
          <p>{useTimeAgo(props.createdAt)}</p>
        </div>
      </div>
    </div>
  );
}
