import {
  IProfileActivity,
  IProfileActivityUser,
} from "@/app/api/getActivityProfile/route";
import ActivityCardUser from "./ActivityCardUser";
import React, { useEffect, useMemo } from "react";
import useLoader from "@/hooks/useLoader";
import { useParams } from "next/navigation";
import useDataUser from "@/hooks/useDataUser";
import StatusSendBlock from "./StatusSendBlock";
import BlockFilterActivity from "./BlockFilterActivity";
import AchievementsBlock from "./AchievementsBlock";
import { IProfileProps } from "@/app/api/getDataProfile/route";
export type filterType = "all" | "statuses" | "messages" | "reactions";
export default function BlockActivityUser({ props }: { props: IProfileProps }) {
  const [profileActivity, setProfileActivity] =
    React.useState<IProfileActivity | null>(null);
  const params = useParams();
  const login = params.login;
  const userData = useDataUser();
  const [pageNumber, setPageNumber] = React.useState<number>(0);
  const [filter, setFilter] = React.useState<filterType>("all");
  const { setLoading } = useLoader();
  const totalPages = useMemo(() => {
    return profileActivity
      ? Math.ceil(profileActivity._count.activityUser / 25)
      : 0;
  }, [profileActivity]);
  async function getActivityProfile() {
    setLoading(async () => {
      const req = await fetch("/api/getActivityProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber, login, filterType: filter }),
      });
      const res: { ok: boolean; activity: IProfileActivity | null } =
        await req.json();
      if (res.ok) {
        if (pageNumber > 0) {
          setProfileActivity((prev) => {
            if (!prev) return res.activity;
            const newActivity = res.activity?.activityUser;
            if (!newActivity) return prev;
            const uniqActivity = newActivity.filter(
              (activ: IProfileActivityUser) => {
                return !prev.activityUser.some(
                  (oldActiv) => oldActiv.id === activ.id
                );
              }
            );
            return {
              ...prev,
              activityUser: [...prev.activityUser, ...uniqActivity],
            };
          });
        } else if (pageNumber === 0) {
          setProfileActivity(res.activity);
        }
      }
    });
  }
  useEffect(() => {
    setPageNumber(0);
  }, [filter]);
  useEffect(() => {
    if (!login) return;
    getActivityProfile();
  }, [pageNumber, login, filter]);
  return (
    <div className="flex flex-col lg:w-3/4 gap-2.5">
      <AchievementsBlock
        login={props.login}
        reputation={props.reputation}
        countMessage={props._count.MessagesPosts}
      />
      {userData && userData.login === login && userData.verifyAdm === "Yes" && (
        <StatusSendBlock setProfileActivity={setProfileActivity} />
      )}

      <div className="bg-white dark:bg-[#212121] rounded-md border border-neutral-300 dark:border-neutral-700 flex flex-col">
        <div className="p-2.5 border-b border-neutral-300 dark:border-neutral-700 flex flex-row justify-between items-center">
          <p className="text-lg font-bold text-neutral-700 dark:text-neutral-200">
            Активность
          </p>
          <BlockFilterActivity filter={filter} setFilter={setFilter} />
        </div>
        <div
          className={`flex flex-col overflow-y-auto ${
            profileActivity && profileActivity.activityUser.length > 0
              ? "divide-y divide-neutral-300 dark:divide-neutral-700"
              : "items-center justify-center h-full"
          }`}
        >
          {profileActivity && profileActivity.activityUser.length > 0 ? (
            profileActivity.activityUser.map((active) => {
              return (
                <ActivityCardUser
                  setProfileActivity={setProfileActivity}
                  props={active}
                  key={active.id}
                  login={profileActivity.login}
                  role={profileActivity.role}
                  avatar={profileActivity.avatar}
                />
              );
            })
          ) : (
            <p className="font-medium text-neutral-700 dark:text-neutral-200 py-5">
              Нет активности :(
            </p>
          )}
        </div>
        {totalPages > 1 &&
          totalPages - 1 !== pageNumber &&
          profileActivity?.activityUser.length !==
            profileActivity?._count.activityUser && (
            <div className="flex justify-center py-2.5">
              <button
                onClick={() => setPageNumber((prev) => prev + 1)}
                className=" bg-orange-500 dark:bg-orange-600 px-2.5 py-1.25 cursor-pointer rounded-md font-medium text-white transition-colors duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700"
              >
                Загрузить больше
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
