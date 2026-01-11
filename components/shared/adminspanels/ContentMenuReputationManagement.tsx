import { IUsersReputation } from "@/components/ui/adminspanels/ReputationManagement";
import AvatarUser from "../users/AvatarUser";
import ColorNicknameUser from "../users/ColorNicknameUser";
import CheckNameplateUser from "../users/CheckNameplateUser";
import React from "react";
import InputAny from "../inputs/InputAny";
import ReputationChecker from "@/components/ui/profiles/ReputationChecker";
import useNotify from "@/hooks/useNotify";

export default function ContentMenuReputationManagement({
  props,
  setUsers,
  loading,
  setLoading,
  setIsOpenMenu,
}: {
  setIsOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;

  loading: boolean;
  setLoading: React.TransitionStartFunction;
  setUsers: React.Dispatch<React.SetStateAction<IUsersReputation[]>>;
  props: IUsersReputation;
}) {
  const [value, setValue] = React.useState<string>("");
  const { setIsNotify, setMessage } = useNotify();
  const [selectAction, setSelectAction] = React.useState<
    "null" | "up" | "down"
  >("null");
  async function changeReputation() {
    const reputation = Number(value);

    if (isNaN(reputation)) {
      setMessage("Ошибка: введено не число");
      setIsNotify(true);
      return;
    }
    if (value.trim().length === 0) {
      setMessage("Ошибка: вы не ввели количество репутации");
      setIsNotify(true);
      return;
    }
    if (selectAction === "null") {
      setMessage("Ошибка: вы не выбрали действие");
      setIsNotify(true);
      return;
    }
    if (reputation <= 0) {
      setMessage("Ошибка: введите положительное число");
      setIsNotify(true);
      return;
    }
    setLoading(async () => {
      const idUser = props.id;
      const req = await fetch("/api/changeReputation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reputation: reputation,
          idUser: idUser,
          action: selectAction,
        }),
      });
      const res = await req.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((user) => {
            if (user.id === idUser) {
              return { ...user, reputation: res.reputation };
            } else {
              return user;
            }
          })
        );
        window.document.body.style.overflow = "unset";
        setIsOpenMenu(false);
        setMessage(res.message);
        setIsNotify(true);
      } else {
        setMessage("Ошибка: " + res.error);
        setIsNotify(true);
      }
    });
  }
  return (
    <div className="pt-2.5 flex flex-col gap-5 justify-center items-center">
      <div className="flex flex-col gap-2.5 justify-center items-center w-full ">
        <ColorNicknameUser
          user={{ role: props.role, login: props.login }}
          fontSize={18}
          fontWeight={600}
        />
        <AvatarUser
          props={{
            role: props.role,
            avatar: props.avatar || undefined,
            width: 128,
            height: 128,
          }}
        />
        <CheckNameplateUser role={props.role} />
      </div>
      <div>
        <p className="text-neutral-800 dark:text-neutral-200 font-medium">
          Репутация:
        </p>
        <ReputationChecker reputation={props.reputation} />
      </div>
      <div className="flex flex-row w-full justify-between gap-1.25 border p-1.25 rounded-md border-neutral-300 dark:border-neutral-700">
        <button
          disabled={loading}
          onClick={() => setSelectAction("up")}
          className={`cursor-pointer w-1/2 disabled:text-neutral-500 dark:disabled:text-neutral-400  disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 ${
            selectAction === "up"
              ? "bg-green-500 dark:bg-green-600 text-white"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          } transition-colors duration-300 ease-out py-1.25 rounded-sm font-medium text-sm`}
        >
          Повысить
        </button>
        <button
          disabled={loading}
          onClick={() => setSelectAction("down")}
          className={`cursor-pointer w-1/2 disabled:text-neutral-500 dark:disabled:text-neutral-400  disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 ${
            selectAction === "down"
              ? "bg-red-500 dark:bg-red-600 text-white"
              : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-300 dark:hover:bg-neutral-700"
          } transition-colors duration-300 ease-out py-1.25 rounded-sm font-medium text-sm`}
        >
          Понизить
        </button>
      </div>
      <InputAny
        id="valueReputation"
        pattern="[0-9]*"
        placeholder="Введите кол-во репутации"
        value={value}
        onChange={setValue}
        type="number"
      />

      <button
        disabled={selectAction === "null" || loading}
        onClick={
          selectAction === "null" || loading
            ? undefined
            : () => changeReputation()
        }
        className={`${
          selectAction === "null"
            ? "cursor-default bg-neutral-300 dark:bg-neutral-700"
            : selectAction === "down"
            ? "cursor-pointer bg-red-500 dark:bg-red-600 hover:bg-red-400 active:bg-red-600 dark:hover:bg-red-500 dark:active:bg-red-700"
            : "cursor-pointer bg-green-500 dark:bg-green-600 hover:bg-green-400 dark:hover:bg-green-500 active:bg-green-600 dark:active:bg-green-700"
        } py-1.25 w-full rounded-md disabled:text-neutral-500 dark:disabled:text-neutral-400  disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 font-medium transition-colors duration-300 ease-out text-white`}
      >
        {selectAction === "null"
          ? "Выберите действие"
          : selectAction === "down"
          ? "Понизить"
          : "Повысить"}
      </button>
    </div>
  );
}
