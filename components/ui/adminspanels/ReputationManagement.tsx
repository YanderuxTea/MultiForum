"use client";
import ReputationCardUsers from "@/components/shared/adminspanels/ReputationCardUsers";
import InputAny from "@/components/shared/inputs/InputAny";
import Pagination from "@/components/shared/Pagination";
import StubRoleManagementCards from "@/components/shared/stubs/StubRoleManagementCards";
import useDebounce from "@/hooks/useDebounce";
import { AnimatePresence } from "framer-motion";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import OpenMenuAdminsPanelProvider from "@/components/providers/OpenMenuAdminsPanelProvider";
import MenuWindow from "../menus/MenuWindow";
import ContentMenuReputationManagement from "@/components/shared/adminspanels/ContentMenuReputationManagement";
export interface IUsersReputation {
  id: string;
  role: string;
  avatar: string | null;
  reputation: number;
  login: string;
}
export default function ReputationManagement() {
  const [value, setValue] = React.useState<string>("");
  const [loading, setLoading] = React.useTransition();
  const [pending, setPending] = React.useTransition();
  const [users, setUsers] = React.useState<IUsersReputation[]>([]);
  const [countUsers, setCountUsers] = React.useState<number>(0);
  const [pageNumber, setPageNumber] = React.useState<number>(0);
  const [isOpenMenu, setIsOpenMenu] = React.useState<boolean>(false);
  const [userSelected, setUserSelected] =
    React.useState<IUsersReputation | null>(null);
  const totalPages = React.useMemo(() => {
    return Math.ceil(countUsers / 5);
  }, [countUsers]);
  const queryDebounce = useDebounce(value, 500);
  useEffect(() => {
    setPageNumber(0);
  }, [queryDebounce]);
  useEffect(() => {
    setLoading(async () => {
      const search = queryDebounce.trim();
      setUsers([]);
      const req = await fetch("/api/getUsersReputationManagement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber: pageNumber, query: search }),
      });
      const res = await req.json();
      if (res.ok) {
        setUsers(res.users);
        setCountUsers(res.countUsers);
      } else {
        setUsers([]);
      }
    });
  }, [queryDebounce, pageNumber]);

  return (
    <div className="bg-white dark:bg-[#212121] border border-neutral-300 dark:border-neutral-700 w-full rounded-md p-5 flex flex-col gap-2.5">
      <InputAny
        placeholder="Поиск пользователя"
        value={value}
        onChange={setValue}
        id="querySearchReputationManagement"
      />
      <OpenMenuAdminsPanelProvider>
        <AnimatePresence>
          {isOpenMenu && (
            <MenuWindow
              props={{
                pending: pending,
                content: (
                  <ContentMenuReputationManagement
                    setIsOpenMenu={setIsOpenMenu}
                    loading={pending}
                    setLoading={setPending}
                    setUsers={setUsers}
                    props={
                      userSelected ?? {
                        login: "",
                        avatar: "",
                        role: "",
                        reputation: 0,
                        id: "",
                      }
                    }
                  />
                ),
                setIsOpenMenu: setIsOpenMenu,
                isOpenMenu: isOpenMenu,
              }}
            />
          )}
        </AnimatePresence>
      </OpenMenuAdminsPanelProvider>
      <div
        className={`grow flex flex-col gap-2.5 overflow-clip h-97.5 ${
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
                <ReputationCardUsers
                  setUserSelected={setUserSelected}
                  key={user.id}
                  props={user}
                  setIsOpenMenu={setIsOpenMenu}
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
              className="font-medium text-neutral-700 dark:text-neutral-300 text-center w-full"
            >
              Пользователей с таким никнеймом нет
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <Pagination
        count={countUsers}
        setPageNumber={setPageNumber}
        pageNumber={pageNumber}
        totalPages={totalPages}
      />
    </div>
  );
}
