import React, { RefObject, useEffect } from "react";
import { Editor, JSONContent } from "@tiptap/core";
import { EditorContent } from "@tiptap/react";
import InputToolbar from "@/components/shared/InputToolbar";
import useNotify from "@/hooks/useNotify";
import { useSearchParams } from "next/navigation";
import { IMessage } from "@/context/CategoriesContext";
import useEditorHook from "@/hooks/useEditorHook";

export default function InputAnswer({
  editorRef,
  pending,
  setPending,
  setMessages,
  setPageNumber,
}: {
  editorRef: RefObject<Editor | null>;
  pending: boolean;
  setPending: React.TransitionStartFunction;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | undefined>>;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
}) {
  const [value, setValue] = React.useState<JSONContent | string>("");
  const editor = useEditorHook({ value: value, setValue: setValue });
  const { setMessage, setIsNotify } = useNotify();
  const searchParams = useSearchParams();
  const themeId = searchParams.get("themeId");
  const subCategoryId = searchParams.get("subCategoryId");
  useEffect(() => {
    if (!editor || !editorRef) return;
    editorRef.current = editor;
    return () => {
      editorRef.current = null;
    };
  }, [editor, editorRef]);
  async function handleSubmit() {
    setPending(async () => {
      if (editor && editor.getText().trim().length === 0) {
        setMessage("Ошибка: введите текст для отправки сообщения");
        setIsNotify(true);
        return;
      }
      const req = await fetch("/api/categories/createAnswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          themeId: themeId,
          data: value,
          subCategoryId: subCategoryId,
        }),
      });
      const res = await req.json();
      if (res.status === 429) {
        setMessage(
          `Ошибка: отправить сообщение можно только через ${res.error} секунд`
        );
        setIsNotify(true);
        return;
      }
      if (res.ok) {
        setPageNumber(Math.ceil(res.data.Posts._count.MessagesPosts / 20) - 1);
        setMessages((prevState) =>
          (prevState || []).map((mess) => {
            if (mess.idUser === res.data.idUser) {
              return {
                ...mess,
                Users: {
                  ...mess.Users,
                  _count: {
                    ...mess.Users._count,
                    MessagesPosts: mess.Users._count.MessagesPosts + 1,
                  },
                },
                Posts: {
                  ...mess.Posts,
                  _count: {
                    MessagesPosts: mess.Posts._count.MessagesPosts + 1,
                  },
                },
              };
            }
            return {
              ...mess,
              Posts: {
                ...mess.Posts,
                _count: {
                  MessagesPosts: mess.Posts._count.MessagesPosts + 1,
                },
              },
            };
          })
        );
        setMessages((prevState) => [...(prevState || []), res.data]);
        if (editor) {
          editor.commands.setContent({
            type: "doc",
            content: [{ type: "paragraph" }],
          });
        }
        window.scrollTo({
          top: document.body.scrollHeight,
        });
      } else {
        setMessage(`Ошибка: ${res.error}`);
        setIsNotify(true);
      }
    });
  }
  return (
    <div className="bg-white dark:bg-[#212121] p-5 rounded-md border border-neutral-300 dark:border-neutral-700 flex flex-col gap-5">
      <div>
        <InputToolbar editor={editor} pending={pending} />
        <EditorContent
          readOnly={pending}
          editor={editor}
          className="break-all"
        />
      </div>
      <div className="w-full justify-end flex">
        <button
          onClick={() => handleSubmit()}
          disabled={pending}
          className="disabled:cursor-default disabled:bg-neutral-300 dark:disabled:bg-neutral-700 bg-orange-500 dark:bg-orange-600 px-2.5 py-1.25 rounded-md cursor-pointer font-medium text-white hover:bg-orange-400 dark:hover:bg-orange-500 active:bg-orange-600 dark:active:bg-orange-700 transition-colors duration-300 ease-out max-w-max"
        >
          Отправить
        </button>
      </div>
    </div>
  );
}
