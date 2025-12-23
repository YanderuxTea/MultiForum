"use client";
import { getUsers } from "@/components/ui/adminspanels/PunishmentManagement";
import { PropsUseUnbanUser } from "@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces";

export default function useUnbanUser({ props }: { props: PropsUseUnbanUser }) {
  async function unbanUser() {
    props.setPending(async () => {
      if (props.selectBans.length === 0) {
        props.setIsNotify(true);
        props.setMessage("Ошибка: выберите хотя бы 1 активный бан");
      } else if (props.reason.trim().length === 0) {
        props.setIsNotify(true);
        props.setMessage("Ошибка: напишите причину разблокировки");
      } else if (
        props.reason.trim().length > 0 &&
        props.selectBans.length > 0
      ) {
        const req = await fetch("/api/unbanUser", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            selectBans: props.selectBans,
            reason: props.reason,
          }),
        });
        const res: {
          ok: boolean;
          message: string;
          result: {
            id: string;
            idBan: string;
            idUser: string;
            reason: string;
            date: Date;
            admin: string;
          }[];
        } = await req.json();
        if (res.ok) {
          props.setMessage(res.message);
          props.setIsNotify(true);
          props.setIsOpen(false);
          window.document.body.style.overflow = "unset";
          const newUsers = props.users.filter((user) => user.id !== props.id);
          const newCountUsers = props.countUsers - 1;
          const newTotalPages = Math.ceil(newCountUsers / 5);
          props.setUsers(newUsers);
          props.setCountUsers(newCountUsers);
          if (
            newUsers.length === 0 &&
            (props.pageNumber === newTotalPages - 1 || props.pageNumber === 0)
          ) {
            getUsers(
              props.debounceQuery,
              props.setLoading,
              props.pageNumber,
              props.searchParams,
              props.setUsers,
              props.setCountUsers,
              props.setMessage,
              props.setIsNotify
            );
          }
        }
      }
    });
  }
  return unbanUser;
}
