import { IUserRoleManagement } from "@/components/ui/adminspanels/RoleManagement";
import React from "react";
export async function fetchSearchUsersRoleManagement({
  query,
  setUsers,
  setCountUsers,
  pageNumber,
  searchParams,
  setMessage,
  setIsNotify,
}: {
  query: string;
  setUsers: React.Dispatch<React.SetStateAction<IUserRoleManagement[]>>;
  setLoading: React.TransitionStartFunction;
  setCountUsers: React.Dispatch<
    React.SetStateAction<{ role: string; _count: { role: number } }[]>
  >;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsNotify: React.Dispatch<React.SetStateAction<boolean>>;
  pageNumber: number;
  searchParams: string | null;
}) {
  if (query.trim().length === 0) {
    return;
  }
  const req = await fetch("/api/searchUsersRoleManagement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      role: searchParams
        ?.toString()
        .slice(0, searchParams.length - 1)
        .toLowerCase(),
      query: query.trim(),
      pageNumber: pageNumber,
    }),
  });
  const res = await req.json();
  if (res.ok) {
    setUsers(res.users);
    setCountUsers((prev) =>
      prev.map((item) => {
        const found = res.counts.find(
          (c: { role: string; _count: { role: number } }) => {
            if (c.role.toLowerCase() === item.role.toLowerCase()) {
              return c;
            }
          }
        );
        return found ? found : { role: item.role, _count: { role: 0 } };
      })
    );
  } else {
    setMessage("Ошибка: " + res.message);
    setIsNotify(true);
  }
}
export default function InputForSearchAdminsPanels({
  query,
  setQuery,
}: {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="relative">
      <input
        type="text"
        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
        value={query}
        onChange={(e) => setQuery(e.target.value.trim())}
        placeholder="Поиск пользователя"
        className="border p-1.25 rounded-md border-neutral-500 dark:border-neutral-500 outline-none w-full bg-white dark:bg-[#212121] relative z-1 peer"
        autoComplete={"off"}
        name="searchUsersRoleManagement"
      />
      <span className="absolute inset-0 z-0 rounded-md outline-1 blur-[5px] outline-neutral-900 dark:outline-neutral-100 transition-opacity duration-300 ease-out opacity-0 peer-focus:opacity-100"></span>
    </div>
  );
}
