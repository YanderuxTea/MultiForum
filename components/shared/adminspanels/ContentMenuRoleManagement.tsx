import AvatarUser from "@/components/shared/users/AvatarUser";
import CheckNameplateUser from "@/components/shared/users/CheckNameplateUser";
import { inputsSelectRoleData } from "@/data/inputsSelectRoleData";
import InputsSelectRoleUsers from "@/components/shared/inputs/InputsSelectRoleUsers";
import React from "react";
import useOpenMenuAdminsPanel from "@/hooks/useOpenMenuAdminsPanel";
import { AnimatePresence, motion } from "framer-motion";
import { IUserRoleManagement } from "@/components/ui/adminspanels/RoleManagement";
import useNotify from "@/hooks/useNotify";
import ColorNicknameUser from "@/components/shared/users/ColorNicknameUser";

interface IProps {
  id: string;
  avatar?: string;
  login: string;
  role: string;
}

export default function ContentMenuRoleManagement({
  props,
  setUser,
  users,
  pending,
  setPending,
  setCountUsers,
  getUsers,
  pageNumber,
  setPageNumber,
  countUsers,
}: {
  props: IProps;
  setUser: React.Dispatch<React.SetStateAction<IUserRoleManagement[]>>;
  setCountUsers: React.Dispatch<
    React.SetStateAction<{ role: string; _count: { role: number } }[]>
  >;
  users: IUserRoleManagement[];
  pending: boolean;
  setPending: React.TransitionStartFunction;
  getUsers: () => Promise<void>;
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  countUsers: { role: string; _count: { role: number } }[];
}) {
  const { isOpenList, setIsOpenList, setIsOpen } = useOpenMenuAdminsPanel();
  const { setMessage, setIsNotify } = useNotify();
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    if (!data.selectUserRole || props.role === data.selectUserRole) {
      setIsNotify(true);
      setMessage(
        "Ошибка: роль пользователя не выбрана или она совпадает с текущей ролью"
      );
    } else {
      setPending(async () => {
        const req = await fetch("/api/changeUserRole", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: data.selectUserRole, id: props.id }),
        });
        const res = await req.json();
        if (res.ok) {
          const newArray = users.filter((user) => user.id !== props.id);
          const oldRoleUser = props.role.toLowerCase();
          const newRoleUser = data.selectUserRole.toString().toLowerCase();
          const newCountUser = countUsers.map((item) => {
            if (item.role.toLowerCase() === oldRoleUser) {
              return {
                _count: { role: item._count.role - 1 },
                role: item.role,
              };
            }
            if (item.role.toLowerCase() === newRoleUser) {
              return {
                _count: { role: item._count.role + 1 },
                role: item.role,
              };
            }
            return item;
          });
          setUser(newArray);
          setIsOpen(false);
          setCountUsers(newCountUser);
          const newTotalPages = () => {
            const found = newCountUser.find((c) => {
              if (c.role.toLowerCase() === oldRoleUser) {
                return c;
              }
            });
            return Math.ceil((found?._count.role || 0) / 5);
          };
          if (newArray.length === 0) {
            if (newTotalPages() - 1 < pageNumber && pageNumber > 0) {
              setPageNumber(pageNumber - 1);
            } else {
              getUsers();
            }
          } else if (newArray.length === 0) {
            getUsers();
          }
          window.document.body.style.overflow = "unset";
          setIsOpenList(false);
          setIsNotify(true);
          setMessage(res.message);
        }
      });
    }
  }
  return (
    <form onSubmit={submit} className="flex flex-col gap-5 items-center">
      <p className="mt-2.5 font-bold text-center text-lg">
        Изменение роли пользователя
      </p>
      <div className="flex flex-col gap-2.5 items-center w-full">
        <ColorNicknameUser
          user={{ role: props.role, login: props.login }}
          fontSize={20}
          fontWeight={700}
        />
        <AvatarUser
          props={{
            avatar: props.avatar,
            role: props.role,
            width: 128,
            height: 128,
          }}
        />
        <CheckNameplateUser role={props.role} />
      </div>
      <div className="flex flex-col">
        <p
          className={`font-medium transition-colors duration-300 ease-out text-center cursor-pointer ${
            isOpenList
              ? "text-neutral-800 dark:text-neutral-200"
              : "text-neutral-600 dark:text-neutral-400"
          }`}
          onClick={!pending ? () => setIsOpenList(!isOpenList) : undefined}
        >
          Выбрать роль пользователя
        </p>
        <AnimatePresence>
          {isOpenList && (
            <motion.div
              initial={{ height: 0, marginTop: 0 }}
              animate={{ height: "auto", marginTop: 10 }}
              exit={{ height: 0, marginTop: 0 }}
              className="flex flex-col overflow-clip items-center gap-2.5"
            >
              {inputsSelectRoleData.map((item, i) => {
                return (
                  <InputsSelectRoleUsers
                    props={item}
                    key={i}
                    role={props.role}
                    pending={pending}
                  />
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="transition-colors duration-300 ease-out bg-orange-500 dark:bg-orange-600 hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 px-2.5 py-1.25 rounded-md font-medium text-white w-full cursor-pointer disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:after:opacity-0"
      >
        {pending ? "Изменяем" : "Изменить"}
      </button>
    </form>
  );
}
