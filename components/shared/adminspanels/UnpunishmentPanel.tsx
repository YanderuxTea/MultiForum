import ActiveBansWarns from "@/components/shared/adminspanels/ActiveBansWarns";
import InputPunishment from "@/components/shared/inputs/InputPunishment";
import React from "react";
import {
  IBans,
  IUser,
  IWarns,
} from "@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces";
import useUnbanUser from "@/hooks/useUnbanUser";
import useOpenMenuAdminsPanel from "@/hooks/useOpenMenuAdminsPanel";
import useNotify from "@/hooks/useNotify";
import useUnwarnUser from "@/hooks/useUnwarnUser";

export default function UnpunishmentPanel({
  setCountUsers,
  activeBans,
  setSelectBans,
  setSelectWarns,
  pending,
  selectBans,
  selectWarns,
  activeWarns,
  reason,
  setReason,
  setPending,
  setUsers,
  setPageNumber,
  users,
  countUsers,
  pageNumber,
  debounceQuery,
  setLoading,
  searchParams,
}: {
  searchParams: string | null;
  debounceQuery: string;
  setLoading: React.TransitionStartFunction;
  pageNumber: number;
  countUsers: number;
  users: IUser[];
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  activeBans: IBans[];
  setCountUsers: React.Dispatch<React.SetStateAction<number>>;
  setSelectBans: React.Dispatch<React.SetStateAction<IBans[]>>;
  setSelectWarns: React.Dispatch<React.SetStateAction<IWarns[]>>;
  pending: boolean;
  selectBans: IBans[];
  selectWarns: IWarns[];
  activeWarns: IWarns[];
  reason: string;
  setReason: React.Dispatch<React.SetStateAction<string>>;
  setPending: React.TransitionStartFunction;
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
}) {
  const { id, setIsOpen } = useOpenMenuAdminsPanel();
  const { setIsNotify, setMessage } = useNotify();
  const unbanUser = useUnbanUser({
    props: {
      debounceQuery,
      setLoading,
      searchParams,
      pageNumber,
      countUsers,
      users,
      setPageNumber: setPageNumber,
      setCountUsers: setCountUsers,
      setUsers: setUsers,
      selectBans: selectBans,
      id: id,
      reason: reason,
      setIsNotify: setIsNotify,
      setIsOpen: setIsOpen,
      setMessage: setMessage,
      setPending: setPending,
    },
  });
  const unwarnUser = useUnwarnUser({
    props: {
      setUsers: setUsers,
      selectWarns: selectWarns,
      id: id,
      reason: reason,
      setIsNotify: setIsNotify,
      setIsOpen: setIsOpen,
      setMessage: setMessage,
      setPending: setPending,
    },
  });
  return (
    <div className="flex flex-col gap-2.5">
      <p className="text-neutral-800 dark:text-neutral-200 font-medium">
        Активные баны:
      </p>
      <div
        className={`flex flex-col py-2.5 gap-2.5 h-50 overflow-y-auto border border-neutral-300 bg-neutral-100 dark:border-neutral-700 rounded-md dark:bg-neutral-900 ${
          activeBans.length === 0 && "justify-center items-center"
        }`}
      >
        {activeBans.length > 0 ? (
          activeBans.map((ban) => {
            return (
              <ActiveBansWarns
                key={ban.id}
                propsBan={{
                  id: ban.id,
                  date: ban.date,
                  reason: ban.reason,
                  admin: ban.admin,
                  idUser: ban.idUser,
                  time: ban.time,
                }}
                setSelectBans={setSelectBans}
                selectBans={selectBans}
                pending={pending}
              />
            );
          })
        ) : (
          <p className="text-neutral-700 dark:text-neutral-300 font-medium">
            Нет активных банов
          </p>
        )}
      </div>
      <p className="text-neutral-800 dark:text-neutral-200 font-medium">
        Действующие варны:
      </p>
      <div
        className={`flex flex-col py-2.5 gap-2.5 h-50 overflow-y-auto border bg-neutral-100 border-neutral-300 dark:border-neutral-700 rounded-md dark:bg-neutral-900 ${
          activeWarns.length === 0 && "justify-center items-center"
        }`}
      >
        {activeWarns.length > 0 ? (
          activeWarns.map((warn) => {
            return (
              <ActiveBansWarns
                key={warn.id}
                propsWarn={{
                  id: warn.id,
                  date: warn.date,
                  reason: warn.reason,
                  admin: warn.admin,
                  idUser: warn.idUser,
                }}
                setSelectWarns={setSelectWarns}
                selectWarns={selectWarns}
                pending={pending}
              />
            );
          })
        ) : (
          <p className="text-neutral-700 dark:text-neutral-300 font-medium">
            Нет варнов
          </p>
        )}
      </div>
      <InputPunishment
        props={{
          reason: reason,
          setReason: setReason,
          pending: pending,
          placeholder: "Причина",
          id: "unpunishmentReasonInput",
          name: "unpunishmentReason",
        }}
      />
      <div className="flex flex-row justify-between gap-1.25">
        <button
          disabled={pending}
          onClick={() => unwarnUser()}
          className="w-1/2 text-center bg-lime-300 dark:bg-lime-400 hover:bg-lime-200 dark:hover:bg-lime-300 active:bg-lime-400 dark:active:bg-lime-500 transition-colors duration-300 ease-out text-neutral-900 p-1.25 font-medium text-sm cursor-pointer rounded-md disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-default disabled:text-neutral-100"
        >
          Разварнить
        </button>
        <button
          disabled={pending}
          onClick={() => unbanUser()}
          className="w-1/2 text-center bg-emerald-600 dark:bg-emerald-700 hover:bg-emerald-500 dark:hover:bg-emerald-600 active:bg-emerald-700 dark:active:bg-emerald-800 transition-colors duration-300 ease-out p-1.25 font-medium text-sm cursor-pointer rounded-md text-neutral-100 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-default"
        >
          Разбанить
        </button>
      </div>
    </div>
  );
}
