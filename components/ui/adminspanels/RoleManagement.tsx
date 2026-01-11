"use client";
import { useSearchParams } from "next/navigation";
import { roleManagementData } from "@/data/roleManagementData";
import SearchParamsCardAdminsPanel from "@/components/shared/adminspanels/SearchParamsCardAdminsPanel";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import CardUsersAdminsPanel from "@/components/shared/adminspanels/CardUsersAdminsPanel";
import Pagination from "@/components/shared/Pagination";
import { AnimatePresence, motion } from "framer-motion";
import InputForSearchAdminsPanels, {
  fetchSearchUsersRoleManagement,
} from "@/components/shared/inputs/InputForSearchAdminsPanels";
import MenuWindow from "@/components/ui/menus/MenuWindow";
import useOpenMenuAdminsPanel from "@/hooks/useOpenMenuAdminsPanel";
import StubRoleManagementCards from "@/components/shared/stubs/StubRoleManagementCards";
import ContentMenuRoleManagement from "@/components/shared/adminspanels/ContentMenuRoleManagement";
import useNotify from "@/hooks/useNotify";
import useDebounce from "@/hooks/useDebounce";

export interface IUserRoleManagement {
  id: string;
  login: string;
  avatar?: string;
  role: string;
}

export default function ManagementRolesPanel() {
  const searchParams = useSearchParams().get("searchParams");
  const [users, setUsers] = useState<IUserRoleManagement[]>([]);
  const { setIsNotify, setMessage } = useNotify();
  const [countUsers, setCountUsers] = useState<
    { role: string; _count: { role: number } }[]
  >([
    { role: "user", _count: { role: 0 } },
    { role: "moderator", _count: { role: 0 } },
    { role: "admin", _count: { role: 0 } },
  ]);
  const [query, setQuery] = useState("");
  const queryDebounced = useDebounce(query, 500);
  const [pageNumber, setPageNumber] = useState(0);
  const [loading, setLoading] = useTransition();
  const [pending, setPending] = useTransition();
  const countUsersRole = useMemo(() => {
    const found = countUsers.find(
      (item) =>
        item.role.toLowerCase() ===
        searchParams?.slice(0, searchParams.length - 1).toLowerCase()
    );
    return found?._count.role || 0;
  }, [countUsers, searchParams]);
  const totalPages = useMemo(() => {
    return Math.ceil(countUsersRole / 5);
  }, [countUsersRole]);
  useEffect(() => {
    setPageNumber(0);
  }, [queryDebounced]);
  const getUsers = useCallback(async () => {
    setLoading(async () => {
      const search = queryDebounced.trim();
      setUsers([]);
      if (search.length > 0) {
        fetchSearchUsersRoleManagement({
          query: search,
          setUsers,
          setLoading,
          setCountUsers,
          pageNumber,
          searchParams,
          setMessage: setMessage,
          setIsNotify: setIsNotify,
        });
        return;
      } else {
        const req = await fetch("/api/getDataRoleManagement", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            pageNumber: pageNumber,
            role: searchParams?.slice(0, searchParams.length - 1),
          }),
        });
        const data = await req.json();
        if (data.ok) {
          setUsers(data.users);
          setCountUsers((prev) =>
            prev.map((item) => {
              const found = data.counts.find(
                (c: { role: string; _count: { role: number } }) => {
                  if (c.role.toLowerCase() === item.role.toLowerCase()) {
                    return c;
                  }
                }
              );
              return found ? found : item;
            })
          );
        }
      }
    });
  }, [
    pageNumber,
    searchParams,
    setLoading,
    setUsers,
    setCountUsers,
    queryDebounced,
    setMessage,
    setIsNotify,
  ]);
  useEffect(() => {
    getUsers();
  }, [getUsers]);
  const { isOpen, setIsOpen, role, login, avatar, id, setIsOpenList } =
    useOpenMenuAdminsPanel();
  return (
    <div className="flex flex-col bg-white dark:bg-[#212121]  border rounded-md border-neutral-300 dark:border-neutral-700 p-5 gap-5 w-full">
      <AnimatePresence>
        {isOpen && (
          <MenuWindow
            props={{
              setIsOpenMenu: setIsOpen,
              isOpenMenu: isOpen,
              setIsHelp: setIsOpenList,
              content: (
                <ContentMenuRoleManagement
                  pageNumber={pageNumber}
                  countUsers={countUsers}
                  setPageNumber={setPageNumber}
                  getUsers={getUsers}
                  setCountUsers={setCountUsers}
                  props={{ avatar: avatar, login: login, id: id, role: role }}
                  setUser={setUsers}
                  users={users}
                  pending={pending}
                  setPending={setPending}
                />
              ),
              pending: pending,
            }}
          />
        )}
      </AnimatePresence>
      <div className="flex flex-col gap-2.5">
        {roleManagementData.map((item, index) => {
          return (
            <SearchParamsCardAdminsPanel
              key={index}
              props={item}
              count={{
                user:
                  countUsers.find(
                    (count) => count.role.toLowerCase() === "user"
                  )?._count.role || 0,
                moderator:
                  countUsers.find(
                    (count) => count.role.toLowerCase() === "moderator"
                  )?._count.role || 0,
                admin:
                  countUsers.find(
                    (count) => count.role.toLowerCase() === "admin"
                  )?._count.role || 0,
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
          ) : users?.length > 0 ? (
            users.map((item) => {
              return (
                <CardUsersAdminsPanel
                  key={item.id}
                  props={item}
                  warns={[]}
                  bans={[]}
                />
              );
            })
          ) : (
            <motion.p
              initial={{ opacity: 0, y: 200 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              layout
              className="w-full text-center font-medium text-neutral-900 dark:text-neutral-100"
            >
              Пользователей нет
            </motion.p>
          )}
        </AnimatePresence>
      </div>
      <Pagination
        pageNumber={pageNumber}
        count={countUsersRole}
        totalPages={totalPages}
        setPageNumber={setPageNumber}
      />
    </div>
  );
}
