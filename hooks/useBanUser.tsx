import React from "react";
import {
  IBans,
  IUnbans,
  IUser,
} from "@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces";
import { getUsers } from "@/components/ui/adminspanels/PunishmentManagement";

export default function useBanUser({
  time,
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
  pageNumber,
  debounceQuery,
  setLoading,
  searchParams,
}: {
  users: IUser[];
  countUsers: number;
  pageNumber: number;
  debounceQuery: string;
  setLoading: React.TransitionStartFunction;
  searchParams: string | null;

  time: string;
  reason: string;
  setPending: React.TransitionStartFunction;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setCountUsers: React.Dispatch<React.SetStateAction<number>>;
  setIsNotify: React.Dispatch<React.SetStateAction<boolean>>;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  id: string;
}) {
  async function banUser() {
    setPending(async () => {
      const timeNumber = Number(time.replace(/\s/g, ""));
      if (isNaN(timeNumber) || timeNumber < 0) {
        setIsNotify(true);
        setMessage("Ошибка: введите время блокировки в минутах");
        return;
      }
      if (reason.trim().length === 0) {
        setIsNotify(true);
        setMessage("Ошибка: напишите причину бана");
        return;
      }
      if (reason.trim().length > 0 && timeNumber >= 0) {
        const req = await fetch("/api/banUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: id, reason: reason, time: timeNumber }),
        });
        const res: {
          ok: boolean;
          message: string;
          result: IBans & { Unbans: IUnbans | null };
        } = await req.json();
        if (res.ok) {
          setIsNotify(true);
          setMessage(res.message);
          setIsOpen(false);
          window.document.body.style.overflow = "unset";
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
        }
      }
    });
  }
  return banUser;
}
