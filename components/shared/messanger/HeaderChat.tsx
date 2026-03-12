import { useRouter } from "next/navigation";
import Arrow from "../icons/Arrow";
import { IUserData } from "./MainChat";
import AvatarUser from "../users/AvatarUser";
import useSocket from "@/hooks/useSocket.ts";
import Link from "next/link";

export default function HeaderChat({ props }: { props: IUserData }) {
  const router = useRouter();
  const { writingUsers } = useSocket();
  const checkIsWritingUser = writingUsers.includes(props.login);
  return (
    <div className="select-none bg-white dark:bg-[#212121] border-b border-neutral-300 dark:border-neutral-700 p-2.5 flex flex-row lg:rounded-t-lg items-center justify-between z-50">
      <button
        onClick={() => router.replace("/messenger")}
        className="shrink-0 rotate-90 cursor-pointer transition-colors duration-300 ease-out rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 p-1.25"
      >
        <Arrow />
      </button>
      <div className="flex flex-col text-center">
        <Link
          href={`/profile/${props.login}`}
          className="text-neutral-800 dark:text-neutral-200 font-semibold"
        >
          {props.login}
        </Link>
        <p
          className={`${
            props.isOnline || checkIsWritingUser
              ? "text-emerald-400 dark:text-emerald-500"
              : "text-neutral-600" + " dark:text-neutral-400"
          } font-medium text-sm`}
        >
          {checkIsWritingUser
            ? "Печатает..."
            : props.isOnline
              ? "В сети"
              : "Оффлайн"}
        </p>
      </div>
      <AvatarUser
        props={{
          avatar: props.avatar || undefined,
          role: props.role,
          width: 40,
          height: 40,
        }}
      />
    </div>
  );
}
