import {
  IProfileActivity,
  IProfileActivityUser,
} from "@/app/api/getActivityProfile/route";
import useDataUser from "@/hooks/useDataUser";
import useNotify from "@/hooks/useNotify";
import { useParams } from "next/navigation";
import React from "react";

export default function StatusSendBlock({
  setProfileActivity,
}: {
  setProfileActivity: React.Dispatch<
    React.SetStateAction<IProfileActivity | null>
  >;
}) {
  const [text, setText] = React.useState<string>("");

  const [pending, setPending] = React.useTransition();
  const { setIsNotify, setMessage } = useNotify();
  const params = useParams();
  const login = params.login;
  const userData = useDataUser();
  async function sendStatus() {
    setPending(async () => {
      if (userData?.verifyAdm !== "Yes") {
        setIsNotify(true);
        setMessage("Ошибка: недостаточно прав");
        return;
      }
      if (text.trim().length === 0) {
        setIsNotify(true);
        setMessage(
          "Ошибка: длина сообщения не может быть меньше 1 и не больше 100 символов"
        );
        return;
      }
      const req = await fetch("/api/createStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: login, text: text }),
      });
      const res: {
        ok: boolean;
        activity?: IProfileActivityUser;
        error?: string | number;
        status?: number;
      } = await req.json();
      if (res.status) {
        setIsNotify(true);
        setMessage(`Ошибка: повторите попытку через ${res.error} секунд`);
        return;
      }
      if (res.ok) {
        setProfileActivity((prev) => {
          if (!prev || !res.activity) {
            return prev;
          }
          return {
            ...prev,
            activityUser: [res.activity, ...prev.activityUser],
            _count: {
              ...prev._count,
              activityUser: prev._count.activityUser + 1,
            },
          };
        });
        setText("");
      } else {
        setIsNotify(true);
        setMessage("Ошибка " + res.error);
      }
    });
  }
  return (
    <div className="p-2.5 border rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#212121] flex flex-col items-end gap-2.5">
      <textarea
        readOnly={pending}
        disabled={pending}
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        className="border w-full rounded-md border-neutral-300 dark:border-neutral-700 p-2.5 outline-none resize-none max-h-max focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors duration-300 ease-out"
        placeholder="Напишите сообщение всему форуму..."
        maxLength={100}
        id="textareastatus"
      />
      <button
        className="max-w-max bg-orange-500 dark:bg-orange-600 px-2.5 py-1.25 rounded-md text-white font-medium cursor-pointer transition-colors duration-300 ease-out hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700"
        disabled={pending}
        onClick={pending ? undefined : () => sendStatus()}
      >
        Отправить
      </button>
    </div>
  );
}
