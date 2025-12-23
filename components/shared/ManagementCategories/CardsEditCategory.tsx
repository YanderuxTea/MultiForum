import { ICategories } from "@/context/CategoriesContext";
import IconCheck from "@/components/shared/icons/IconCheck";
import React from "react";
import useNotify from "@/hooks/useNotify";
import useCategories from "@/hooks/useCategories";
import Lock from "@/components/shared/icons/Lock";

export default function CardsEditCategory({
  props,
  pending,
  setPending,
}: {
  props: ICategories;
  pending: boolean;
  setPending: React.TransitionStartFunction;
}) {
  const { setIsNotify, setMessage } = useNotify();
  const { setCategories } = useCategories();
  const [newTitle, setNewTitle] = React.useState(props.title);
  const [privateVisible, setPrivateVisible] = React.useState<boolean>(
    props.visible === "Admin"
  );
  async function editCategories() {
    setPending(async () => {
      if (
        props.title.trim() === newTitle.trim() &&
        privateVisible === (props.visible === "Admin")
      ) {
        setIsNotify(true);
        setMessage(
          "Ошибка: вы не ввели новое название или не изменили приватность"
        );
        return;
      } else {
        const req = await fetch("/api/categories/edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: props.id,
            title: newTitle.trim(),
            privateVisible: privateVisible,
          }),
        });
        const res = await req.json();
        if (res.ok) {
          setCategories((prevState) =>
            prevState.map((c) => {
              if (c.id === props.id) {
                return {
                  ...c,
                  title: newTitle.trim(),
                  visible: privateVisible ? "Admin" : "All",
                };
              }
              return c;
            })
          );
          setIsNotify(true);
          setMessage(res.message);
        } else {
          setIsNotify(true);
          setMessage(`Ошибка: ${res.message}`);
        }
      }
    });
  }
  return (
    <div className="flex flex-row justify-between items-center">
      <input
        type="text"
        id={props.id}
        disabled={pending}
        defaultValue={props.title}
        onChange={(e) => setNewTitle(e.target.value)}
        className="outline-none border w-[75%] border-neutral-300 dark:border-neutral-700 rounded-md p-1.25 focus:border-neutral-400 dark:focus:border-neutral-600 transition-colors duration-300 ease-out"
      />
      <label
        htmlFor={`private${props.id}`}
        className="flex items-center justify-center w-8.5 aspect-square cursor-pointer border border-neutral-300 dark:border-neutral-700 rounded-md relative"
      >
        <input
          type="checkbox"
          className="hidden inset-0"
          id={`private${props.id}`}
          defaultChecked={props.visible === "Admin"}
          onChange={(e) => setPrivateVisible(e.target.checked)}
        />
        {privateVisible && <Lock />}
      </label>
      <button
        onClick={() => editCategories()}
        disabled={pending}
        className="cursor-pointer transition-colors duration-300 ease-out hover:bg-green-400 dark:hover:bg-green-500 active:bg-green-600 dark:active:bg-green-700 flex items-center justify-center bg-green-500 dark:bg-green-600 p-1.25 rounded-md disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 select-none"
      >
        <IconCheck />
      </button>
    </div>
  );
}
