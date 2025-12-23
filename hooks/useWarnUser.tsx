import React from "react";
import {
  IBans,
  IUnbans,
  IUnwarns,
  IUser,
  IWarns,
} from "@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces";
import { getUsers } from "@/components/ui/adminspanels/PunishmentManagement";

export default function useWarnUser({
  count,
  reason,
  setPending,
  setMessage,
  setIsNotify,
  setUsers,
  setCountUsers,
  id,
  setIsOpen,
  users,
  countUsers,
  debounceQuery,
  setLoading,
  pageNumber,
  searchParams,
}: {
  debounceQuery: string;
  setLoading: React.TransitionStartFunction;
  pageNumber: number;
  searchParams: string | null;
  countUsers: number;
  users: IUser[];
  setCountUsers: React.Dispatch<React.SetStateAction<number>>;
  count: string;
  reason: string;
  setPending: React.TransitionStartFunction;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setIsNotify: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  id: string;
}) {
  async function warnUser() {
    setPending(async () => {
      const countNumber = Number(count.replace(/\s/g, ""));
      if (countNumber === 0 || isNaN(countNumber)) {
        setIsNotify(true);
        setMessage("Ошибка: введите количество варнов");
        return;
      }
      if (reason.trim().length === 0) {
        setIsNotify(true);
        setMessage("Ошибка: введите причину предупреждения");
        return;
      } else {
        const req = await fetch("/api/warnUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: countNumber, reason: reason, id: id }),
        });
        const res: {
          ok: boolean;
          message: string;
          createdWarns: (IWarns & { Unwarns: IUnwarns | null })[];
          createdBan: IBans & { Unbans: IUnbans | null };
        } = await req.json();
        if (res.ok) {
          setIsNotify(true);
          setMessage(res.message);
          setIsOpen(false);
          window.document.body.style.overflow = "unset";
          if (res.createdBan) {
            const newUsers = users.filter((user) => user.id !== id);
            const newCountUsers = countUsers - 1;
            const newTotalPages = Math.ceil(newCountUsers / 5);
            setUsers(newUsers);
            setCountUsers(newCountUsers);
            if (
              newUsers.length === 0 &&
              (pageNumber === newTotalPages - 1 || pageNumber === 0)
            ) {
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
            }
          } else {
            setUsers((prevState) =>
              prevState.map((user) => {
                if (user.id !== id) {
                  return user;
                }
                const updatedWarns = [...user.warns, ...res.createdWarns];
                const updateBans = res.createdBan
                  ? [...user.bans, res.createdBan]
                  : user.bans;
                updateBans.sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                updatedWarns.sort(
                  (a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                return { ...user, warns: updatedWarns, bans: updateBans };
              })
            );
          }
        }
      }
    });
  }
  return warnUser;
}
