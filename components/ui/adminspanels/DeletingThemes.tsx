"use client";
import InputAny from "@/components/shared/inputs/InputAny.tsx";
import { useState, useTransition } from "react";
import useNotify from "@/hooks/useNotify.ts";
import { deleteTheme } from "@/components/ui/adminspanels/action.ts";

export default function DeletingThemes() {
  const [idTheme, setIdTheme] = useState<string>("");
  const [loading, setLoading] = useTransition();
  const { setIsNotify, setMessage } = useNotify();
  function handleDelete() {
    const id = idTheme.trim();
    if (id.length === 0) {
      setMessage("Ошибка: введите id темы");
      setIsNotify(true);
      return;
    }
    setLoading(async () => {
      const res = await deleteTheme(id);
      if (res.ok) {
        setMessage(res.message);
        setIsNotify(true);
        setIdTheme("");
      } else {
        setMessage(`Ошибка: ${res.message}`);
        setIsNotify(true);
      }
    });
  }
  return (
    <div
      className={
        "bg-white dark:bg-[#212121] w-full rounded-md border border-neutral-300 dark:border-neutral-700 flex" +
        " flex-col p-5 gap-5"
      }
    >
      <p
        className={
          "text-neutral-800 dark:text-neutral-200 text-lg font-semibold"
        }
      >
        Удаление темы
      </p>
      <div
        className={
          "flex flex-col items-center justify-center w-full h-full gap-2.5"
        }
      >
        <InputAny
          placeholder={"Введите id темы"}
          value={idTheme}
          onChange={setIdTheme}
          readonly={loading}
        />
        <button
          disabled={loading}
          onClick={() => handleDelete()}
          className={
            "bg-red-500 dark:bg-red-600 transition-colors duration-300 ease-out hover:bg-red-400" +
            " dark:hover:bg-red-500 active:bg-red-600 dark:active:bg-red-700 cursor-pointer w-full rounded-md" +
            " py-1.25 disabled:bg-neutral-300 dark:disabled:bg-neutral-700 disabled:cursor-default"
          }
        >
          {loading ? "Удаляем" : "Удалить"}
        </button>
      </div>
    </div>
  );
}
