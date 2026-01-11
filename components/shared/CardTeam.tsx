import Link from "next/link";
import AvatarUser from "./users/AvatarUser";
import ColorNicknameUser from "./users/ColorNicknameUser";

export default function CardTeam({
  user,
}: {
  user: { login: string; role: string; avatar: string | null };
}) {
  return (
    <Link
      href={`/profile/${user.login}`}
      className="bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center p-5 gap-2.5 text-center justify-center"
    >
      <AvatarUser
        props={{
          role: user.role,
          avatar: user.avatar ?? undefined,
          width: 55,
          height: 55,
        }}
      />
      <ColorNicknameUser
        user={{ role: user.role, login: user.login }}
        fontSize={18}
        fontWeight={600}
      />
    </Link>
  );
}
