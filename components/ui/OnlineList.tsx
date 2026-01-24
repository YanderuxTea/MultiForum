"use client";
import useSocket from "@/hooks/useSocket";
import Link from "next/link";
import ColorNicknameUser from "../shared/users/ColorNicknameUser";

export default function OnlineList() {
  const socket = useSocket();
  return (
    <div className="bg-white dark:bg-[#212121] w-full p-2.5 justify-center items-center flex flex-col gap-2.5">
      <div className="max-w-300 w-full">
        <span className=" flex flex-row items-center gap-2.5">
          <p className="text-neutral-800 dark:text-neutral-200 font-bold text-xl">
            Онлайн: {socket.onlineList.length}
          </p>
          <div className="bg-green-500 w-4 aspect-square rounded-full animate-pulse"></div>
        </span>
      </div>
      <div className="flex flex-col gap-1.25 w-full max-w-300">
        <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
          Пользователи:
        </p>
        <div className="flex flex-wrap gap-x-2.5">
          {socket.onlineList.length > 0 ? (
            socket.onlineList.map((user) => {
              return user.login === "Гость" ? (
                <span
                  key={user.id}
                  className="text-neutral-600 dark:text-neutral-400 font-medium select-none"
                >
                  {user.login}
                </span>
              ) : (
                <Link href={`/profile/${user.login}`} key={user.id}>
                  <ColorNicknameUser
                    user={{ login: user.login, role: user.role }}
                    fontSize={14}
                    fontWeight={600}
                  />
                </Link>
              );
            })
          ) : (
            <p className="text-sm text-neutral-600 dark:text-neutral-400 font-medium">
              Список пользователей пуст
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
