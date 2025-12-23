import InputPunishment from "@/components/shared/inputs/InputPunishment";
import React, { useState } from "react";
import useWarnUser from "@/hooks/useWarnUser";
import useNotify from "@/hooks/useNotify";
import { IUser } from "@/data/interfaces/adminsPanel/PunishmentPanel/PunishmentPanelInterfaces";
import useOpenMenuAdminsPanel from "@/hooks/useOpenMenuAdminsPanel";
import useBanUser from "@/hooks/useBanUser";

export default function PunishmentPanel({
  pending,
  setPending,
  setUsers,
  setCountUsers,
  searchParams,
  debounceQuery,
  setLoading,
  pageNumber,
  countUsers,
  users,
}: {
  users: IUser[];
  countUsers: number;
  debounceQuery: string;
  setLoading: React.TransitionStartFunction;
  pageNumber: number;
  searchParams: string | null;
  pending: boolean;
  setPending: React.TransitionStartFunction;
  setUsers: React.Dispatch<React.SetStateAction<IUser[]>>;
  setCountUsers: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [time, setTime] = useState<string>("");
  const [count, setCount] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const { setIsNotify, setMessage } = useNotify();
  const { id, setIsOpen } = useOpenMenuAdminsPanel();
  const warnUser = useWarnUser({
    users: users,
    debounceQuery: debounceQuery,
    setLoading: setLoading,
    pageNumber: pageNumber,
    countUsers: countUsers,
    searchParams: searchParams,
    setCountUsers: setCountUsers,
    reason: reason,
    count: count,
    setPending: setPending,
    setMessage: setMessage,
    setIsNotify: setIsNotify,
    setUsers: setUsers,
    id: id,
    setIsOpen: setIsOpen,
  });
  const banUser = useBanUser({
    users: users,
    countUsers: countUsers,
    setLoading: setLoading,
    pageNumber: pageNumber,
    debounceQuery: debounceQuery,
    searchParams: searchParams,
    setCountUsers: setCountUsers,
    reason: reason,
    time: time,
    setPending: setPending,
    setMessage: setMessage,
    setIsNotify: setIsNotify,
    setUsers: setUsers,
    id: id,
    setIsOpen: setIsOpen,
  });
  const punishmentInputData = [
    {
      id: "punishmentTimeInput",
      name: "punishmentTime",
      placeholder: "Время блокировки",
      state: time,
      setter: setTime,
    },
    {
      id: "punishmentCountInput",
      name: "punishmentCount",
      placeholder: "Количество предупреждений",
      state: count,
      setter: setCount,
    },
    {
      id: "punishmentReasonInput",
      name: "punishmentReason",
      placeholder: "Причина блокировки/варна",
      state: reason,
      setter: setReason,
    },
  ];
  return (
    <div className="flex flex-col gap-2.5">
      {punishmentInputData.map((input, index) => {
        return (
          <InputPunishment
            key={index}
            props={{
              pending: pending,
              reason: input.state,
              setReason: input.setter,
              placeholder: input.placeholder,
              name: input.name,
              id: input.id,
            }}
          />
        );
      })}
      <div className="flex flex-row justify-between gap-1.25">
        <button
          disabled={pending}
          onClick={() => warnUser()}
          className="disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-default disabled:text-neutral-100 w-1/2 text-center bg-yellow-300 dark:bg-yellow-400 text-black p-1.25 font-medium text-sm cursor-pointer rounded-md"
        >
          Предупредить
        </button>
        <button
          disabled={pending}
          onClick={() => banUser()}
          className="disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-default w-1/2 text-center bg-red-600 dark:bg-red-700 p-1.25 font-medium text-sm cursor-pointer rounded-md text-neutral-100"
        >
          Забанить
        </button>
      </div>
    </div>
  );
}
