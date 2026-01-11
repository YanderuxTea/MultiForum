import CardTeam from "@/components/shared/CardTeam";
import StubHeader from "@/components/shared/stubs/StubHeader";
import StubUnderHeader from "@/components/shared/stubs/StubUnderHeader";
import { prisma } from "@/lib/prisma";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Multi Forum | Команда",
  description:
    "Команда Multi Forum - администраторы и модераторы, которые следят за порядком, безопасностью и развитием форума.",
};
export const revalidate = 600;
export default async function Page() {
  const team = await prisma.users.findMany({
    where: { OR: [{ role: "Admin" }, { role: "Moderator" }] },
    select: { id: true, login: true, role: true, avatar: true },
    orderBy: { login: "asc" },
  });
  const admins = team.filter((user) => user.role === "Admin");
  const moderators = team.filter((user) => user.role === "Moderator");
  return (
    <main className="flex flex-col px-2.5 w-full py-10 grow items-center">
      <StubHeader />
      <StubUnderHeader />
      <div className="max-w-300 w-full flex flex-col gap-10">
        <div className="flex flex-col w-full divide-y bg-white rounded-md dark:bg-[#212121] border border-neutral-300 dark:border-neutral-700 divide-neutral-300 dark:divide-neutral-700">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 p-2.5">
            Администраторы
          </h1>
          <div
            className={`${
              admins.length > 0
                ? "grid gap-2.5 grid-cols-1 lg:grid-cols-4 auto-rows-fr"
                : "flex justify-center"
            } w-full p-2.5`}
          >
            {admins.length > 0 ? (
              admins.map((user) => {
                return <CardTeam key={user.id} user={user} />;
              })
            ) : (
              <p className="text-neutral-800 dark:text-neutral-200">
                Администраторов пока что нет :(
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col w-full divide-y bg-white rounded-md dark:bg-[#212121] border border-neutral-300 dark:border-neutral-700 divide-neutral-300 dark:divide-neutral-700">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 p-2.5">
            Модераторы
          </h1>
          <div
            className={`${
              moderators.length > 0
                ? "grid-cols-1 lg:grid-cols-4 gap-2.5 grid auto-rows-fr"
                : "flex justify-center"
            } w-full p-2.5   `}
          >
            {moderators.length > 0 ? (
              moderators.map((user) => {
                return <CardTeam key={user.id} user={user} />;
              })
            ) : (
              <p className="text-neutral-800 dark:text-neutral-200">
                Модераторов пока что нет :(
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
