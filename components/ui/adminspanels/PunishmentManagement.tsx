"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Pagination from "@/components/shared/Pagination";
import InputForSearchAdminsPanels from "@/components/shared/inputs/InputForSearchAdminsPanels";
import CardUsersAdminsPanel from "@/components/shared/adminspanels/CardUsersAdminsPanel";
import { punishmentManagementData } from "@/data/punishmentManagementData";
import SearchParamsCardAdminsPanel from "@/components/shared/adminspanels/SearchParamsCardAdminsPanel";
import { AnimatePresence, motion } from "framer-motion";
import useOpenMenuAdminsPanel from "@/hooks/useOpenMenuAdminsPanel";
import MenuWindow from "@/components/ui/menus/MenuWindow";
import StubRoleManagementCards from "@/components/shared/stubs/StubRoleManagementCards";
import ContentMenuPunishmentManagement from "@/components/shared/adminspanels/ContentMenuPunishmentManagement";
import { IUser } from "@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces";
import useDebounce from "@/hooks/useDebounce";
import useNotify from "@/hooks/useNotify";
export async function getUsers(
  debounceQuery: string,
  setLoading: React.TransitionStartFunction,
  pageNumber: number,
  searchParams: string | null,
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>,
  setCountUsers: React.Dispatch<React.SetStateAction<number>>,
  setMessage: React.Dispatch<React.SetStateAction<string>>,
  setIsNotify: React.Dispatch<React.SetStateAction<boolean>>
) {
  const search = debounceQuery.trim();
  setLoading(async () => {
    const req = await fetch("/api/getUsersPunishmentManagement", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        pageNumber,
        search,
        searchParams,
      }),
    });
    const res = await req.json();
    if (res.ok) {
      setUsers(res.users);
      setCountUsers(res.count);
    } else {
      setMessage("Ошибка: " + res.message);
      setIsNotify(true);
    }
  });
}
export default function ManagementPunishmentPanel() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const searchParams = useSearchParams().get("searchParams");
  const [countUsers, setCountUsers] = useState<number>(0);
  const [query, setQuery] = useState("");
  const debounceQuery = useDebounce(query, 500);
  const { isOpen, setIsOpen } = useOpenMenuAdminsPanel();
  const [loading, setLoading] = useTransition();
  const [pending, setPending] = useTransition();
  const { setIsNotify, setMessage } = useNotify();
  const totalPages = useMemo(() => {
    return Math.ceil(countUsers / 5);
  }, [countUsers]);
  useEffect(() => {
    getUsers(
      debounceQuery,
      setLoading,
      pageNumber,
      searchParams,
      setUsers,
      setCountUsers,
      setMessage,
      setIsNotify
    );
  }, [searchParams, pageNumber, debounceQuery]);

  return (
    <div className="bg-white p-5 rounded-md flex flex-col border border-neutral-300 dark:border-neutral-700 dark:bg-[#212121] w-full gap-5">
      <AnimatePresence>
        {isOpen && (
          <MenuWindow
            props={{
              setIsOpenMenu: setIsOpen,
              isOpenMenu: isOpen,
              content: (
                <ContentMenuPunishmentManagement
                  searchParams={searchParams}
                  debounceQuery={debounceQuery}
                  setLoading={setLoading}
                  pageNumber={pageNumber}
                  countUsers={countUsers}
                  setPageNumber={setPageNumber}
                  setCountUsers={setCountUsers}
                  setUsers={setUsers}
                  users={users}
                  banned={searchParams === "banned"}
                  setPending={setPending}
                  pending={pending}
                />
              ),
              pending: pending,
            }}
          />
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-2.5">
        {punishmentManagementData.map((card, index) => {
          return (
            <SearchParamsCardAdminsPanel
              key={index}
              props={{
                title: card.title,
                url: card.url,
                searchParams: card.searchParams,
              }}
            />
          );
        })}
      </div>
      <InputForSearchAdminsPanels query={query} setQuery={setQuery} />
      <div
        className={`flex flex-col gap-2.5 h-97.5 overflow-clip ${
          users.length === 0 && "justify-center items-center"
        }`}
      >
        <AnimatePresence>
          {loading ? (
            [...Array(5)].map((_, index) => {
              return <StubRoleManagementCards key={index} />;
            })
          ) : users.length > 0 ? (
            users.map((user) => {
              return (
                <CardUsersAdminsPanel
                  key={user.id}
                  props={{
                    id: user.id,
                    login: user.login,
                    role: user.role,
                    avatar: user.avatar,
                  }}
                  bans={user.bans}
                  warns={user.warns}
                />
              );
            })
          ) : (
            <motion.p
              layout
              className="w-full text-center font-medium text-neutral-900 dark:text-neutral-100"
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              Пользователей нет
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <Pagination
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
        totalPages={totalPages}
        count={countUsers}
      />
    </div>
  );
}
