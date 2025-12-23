import { IProfileMessage } from "@/app/api/getMessagesProfile/route";
import ActivityCardUser from "./ActivityCardUser";
import React, { useEffect, useMemo } from "react";
import useLoader from "@/hooks/useLoader";
import { useParams } from "next/navigation";

export default function BlockActivityUser({
  countMessage,
}: {
  countMessage: number;
}) {
  const [profileMessages, setProfileMessages] = React.useState<
    IProfileMessage[]
  >([]);
  const params = useParams();
  const login = params.login;
  const [pageNumber, setPageNumber] = React.useState<number>(0);
  const { setLoading } = useLoader();
  const totalPages = useMemo(() => {
    return Math.ceil(countMessage / 25);
  }, [countMessage]);
  async function getMessagesProfile() {
    setLoading(async () => {
      const req = await fetch("/api/getMessagesProfile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber, login }),
      });
      const res = await req.json();
      if (res.ok) {
        setProfileMessages((prevState) => {
          const newMessages = res.messages.MessagesPosts;
          const onlyUniqueMess = newMessages.filter((mess: IProfileMessage) => {
            return !prevState.some((profMess) => profMess.id === mess.id);
          });
          return [...prevState, ...onlyUniqueMess];
        });
      }
    });
  }
  useEffect(() => {
    if (!login) return;
    getMessagesProfile();
  }, [pageNumber, login]);
  return (
    <div className="bg-white dark:bg-[#212121] rounded-md border border-neutral-300 dark:border-neutral-700 flex flex-col lg:w-3/4">
      <div className="p-2.5 border-b border-neutral-300 dark:border-neutral-700">
        <p className="text-lg font-bold text-neutral-700 dark:text-neutral-200">
          Активность
        </p>
      </div>
      <div
        className={`flex flex-col overflow-y-auto ${
          profileMessages.length > 0
            ? "divide-y divide-neutral-300 dark:divide-neutral-700"
            : "items-center justify-center h-full"
        }`}
      >
        {profileMessages.length > 0 ? (
          profileMessages.map((mess) => {
            return <ActivityCardUser props={mess} key={mess.id} />;
          })
        ) : (
          <p className="font-medium text-neutral-700 dark:text-neutral-200 py-5">
            Нет активности :(
          </p>
        )}
      </div>
      {totalPages > 1 &&
        totalPages - 1 !== pageNumber &&
        profileMessages.length === 25 && (
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
  );
}
