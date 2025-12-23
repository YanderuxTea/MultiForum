"use client";
import { IFoundUsers } from "@/app/api/searchUsersThemes/route";
import AvatarUser from "../users/AvatarUser";
import useCurrentWidth from "@/hooks/useCurrentWidth";
import Link from "next/link";
import ColorNicknameUser from "../users/ColorNicknameUser";

export default function FoundUsersCard({ user }: { user: IFoundUsers }) {
  const currentWidth = useCurrentWidth();
  return (
    <Link
      href={`/profile/${user.login}`}
      className="p-2.5 transition-colors duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-800 flex flex-row items-center gap-2.5"
    >
      <AvatarUser
        props={{
          role: user.role,
          avatar: user.avatar ?? undefined,
          width: currentWidth >= 1024 ? 50 : 40,
          height: currentWidth >= 1024 ? 50 : 40,
        }}
      />
      <ColorNicknameUser
        user={{ role: user.role, login: user.login }}
        fontSize={16}
        fontWeight={500}
      />
    </Link>
  );
}
