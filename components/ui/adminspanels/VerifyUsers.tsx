"use client";
import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import VerifyButton from "@/components/shared/buttons/VerifyButton";
import DeleteButton from "@/components/shared/buttons/DeleteButton";
import StubLoadingVerifyPanel from "@/components/shared/stubs/StubLoadingVerifyPanel";
import Pagination from "@/components/shared/Pagination";
import useNotify from "@/hooks/useNotify.ts";

export default function VerifyUsersPanel() {
  const [users, setUsers] = React.useState<
    { id: string; login: string; email: string }[]
  >([]);
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [countUsers, setCountUsers] = React.useState<number>(0);
  const [loading, setLoading] = React.useTransition();
  const [pending, setPending] = React.useTransition();
  const { setMessage, setIsNotify } = useNotify();
  const totalPages = useMemo(() => {
    return Math.ceil(countUsers / 5);
  }, [countUsers]);
  async function getUnverifyUsers() {
    setLoading(async () => {
      const req = await fetch("/api/getUnverifyUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pageNumber: pageNumber }),
      });
      const res = await req.json();
      if (res.ok) {
        setUsers(res.users);
        setCountUsers(res.countUsers);
      } else {
        setMessage(`Ошибка: ${res.message}`);
        setIsNotify(true);
      }
    });
  }
  async function eventUsers(id: string, type: string) {
    setPending(async () => {
      const req = await fetch("/api/verificationUsers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: id, type: type }),
      });
      const res = await req.json();
      if (res.ok) {
        const newUsers = users.filter((user) => user.id !== id);
        setUsers(newUsers);
        if (
          newUsers.length === 0 &&
          pageNumber === totalPages - 1 &&
          pageNumber !== 0
        ) {
          setPageNumber((prevState) => prevState - 1);
        } else if (newUsers.length === 0) {
          getUnverifyUsers();
        }
        setCountUsers((prevState) => prevState - 1);
      }
    });
  }

  useEffect(() => {
    getUnverifyUsers();
  }, [pageNumber]);
  return (
    <div className="flex flex-col p-5 gap-5 bg-white dark:bg-[#212121] rounded-md border border-neutral-300 dark:border-neutral-700 w-full">
      <div
        className={`flex flex-col gap-1.25 h-111.25 overflow-clip ${
          users.length === 0 && "justify-center"
        }`}
      >
        <AnimatePresence>
          {users.length > 0 ? (
            users.map((user) => {
              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  className="border px-2.5 py-1.25 rounded-md border-neutral-300 dark:border-neutral-700 flex flex-row justify-between gap-2.5 items-center"
                >
                  <div className="flex flex-col w-[80%]">
                    <p className="font-bold text-neutral-900 dark:text-neutral-100">
                      {user.login}
                    </p>
                    <p className="text-neutral-700 dark:text-neutral-300 whitespace-nowrap text-ellipsis overflow-clip text-sm">
                      {user.email}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.25">
                    <VerifyButton
                      pending={pending}
                      eventUsers={() => eventUsers(user.id, "verify")}
                    />
                    <DeleteButton
                      pending={pending}
                      eventUsers={() => eventUsers(user.id, "delete")}
                    />
                  </div>
                </motion.div>
              );
            })
          ) : loading ? (
            [...Array(5)].map((_, index) => {
              return <StubLoadingVerifyPanel key={index} />;
            })
          ) : (
            <motion.p
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full text-center font-medium text-neutral-900 dark:text-neutral-100"
            >
              Нет пользователей
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
