"use client";
import React, { useEffect, useMemo, useState, useTransition } from "react";
import InputForSearchAdminsPanels from "@/components/shared/inputs/InputForSearchAdminsPanels";
import Pagination from "@/components/shared/Pagination";
import { AnimatePresence, motion } from "framer-motion";
import StubRoleManagementCards from "@/components/shared/stubs/StubRoleManagementCards";
import MenuWindow from "@/components/ui/menus/MenuWindow";
import useOpenMenuAdminsPanel from "@/hooks/useOpenMenuAdminsPanel";
import ContentMenuAvatarManagement from "@/components/shared/adminspanels/ContentMenuAvatarManagement";
import CardUsersAdminsPanel from "@/components/shared/adminspanels/CardUsersAdminsPanel";
import useNotify from "@/hooks/useNotify";
import useDebounce from "@/hooks/useDebounce";

export interface IUsers {
  id: string;
  login: string;
  avatar?: string;
  role: string;
}
export default function DeleteUsersAvatar() {
  const [users, setUsers] = useState<IUsers[]>([]);
  const [countUsers, setCountUsers] = useState<number>(0);
  const [query, setQuery] = useState<string>("");
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [loading, setLoading] = useTransition();
  const [pending, setPending] = useTransition();
  const { setIsNotify, setMessage } = useNotify();
  const debouncedQuery = useDebounce(query, 500);
  const totalPages = useMemo(() => {
    return Math.ceil(countUsers / 5);
  }, [countUsers]);
  useEffect(() => {
    setPageNumber(0);
  }, [debouncedQuery]);
  useEffect(() => {
    async function getUsers() {
      const search = debouncedQuery.trim();
      setLoading(async () => {
        setUsers([]);
        if (search.length > 0) {
          const req = await fetch("/api/searchUsersAvatarManagement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: search, pageNumber }),
          });
          const res = await req.json();
          if (res.ok) {
            setUsers(res.users);
            setCountUsers(res.count);
          } else {
            setMessage("Ошибка: " + res.message);
            setIsNotify(true);
          }
        } else {
          const req = await fetch("/api/getUsersAvatarManagement", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pageNumber }),
          });
          const res = await req.json();
          if (res.ok) {
            setUsers(res.users);
            setCountUsers(res.count);
          } else {
            setMessage("Ошибка: " + res.message);
            setIsNotify(true);
          }
        }
      });
    }
    getUsers();
  }, [pageNumber, debouncedQuery]);
  const { isOpen, setIsOpen } = useOpenMenuAdminsPanel();
  return (
    <div className="bg-white dark:bg-[#212121] border border-neutral-300 dark:border-neutral-700 rounded-md p-5 flex flex-col gap-5 w-full">
      <AnimatePresence>
        {isOpen && (
          <MenuWindow
            props={{
              setIsOpenMenu: setIsOpen,
              isOpenMenu: isOpen,
              content: (
                <ContentMenuAvatarManagement
                  setUsers={setUsers}
                  users={users}
                  setPending={setPending}
                  pending={pending}
                />
              ),
              pending: pending,
            }}
          />
        )}
      </AnimatePresence>
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
                  props={user}
                  key={user.id}
                  warns={[]}
                  bans={[]}
                />
              );
            })
          ) : (
            <motion.p
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full text-center font-medium text-neutral-900 dark:text-neutral-100"
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
