"use client";
import React, { useEffect, useMemo, useRef } from "react";
import { IMessage } from "@/context/CategoriesContext";
import { useParams, useSearchParams } from "next/navigation";
import useNotify from "@/hooks/useNotify";
import useLoader from "@/hooks/useLoader";
import Pagination from "@/components/shared/Pagination";
import CardMessageTheme from "@/components/shared/themes/CardMessageTheme";
import useDataUser from "@/hooks/useDataUser";
import useCheckingStaff from "@/hooks/useCheckingStaff";
import LockedUnlockedButton from "@/components/shared/themes/LockedUnlockedButton";
import { Editor } from "@tiptap/core";
import HeaderThemes from "@/components/shared/themes/HeaderThemes";
import ChooseContentAnswer from "@/components/shared/themes/ChooseContentAnswer";
import Link from "next/link";

export default function ThemePage() {
  const [messages, setMessages] = React.useState<IMessage[]>();
  const [subCat, setSubCat] = React.useState<{
    id: string;
    title: string;
    visible: boolean;
  }>();
  const [change, setChange] = React.useState<boolean>(false);
  const editorRef = useRef<Editor | null>(null);
  const [pageNumber, setPageNumber] = React.useState<number | null>(null);
  const { setMessage, setIsNotify } = useNotify();
  const { setLoading } = useLoader();
  const searchParams = useSearchParams();
  const params = useParams();
  const themeId = searchParams.get("themeId");
  const subCategoryId = searchParams.get("subCategoryId");
  useEffect(() => {
    if (messages && messages.length === 0 && typeof pageNumber === "number") {
      setPageNumber((prevState) => prevState! - 1);
    }
  }, [messages]);
  const totalPages = useMemo(() => {
    return messages
      ? messages.length > 0
        ? Math.ceil(messages[0].Posts._count.MessagesPosts / 20)
        : 0
      : 0;
  }, [messages]);
  const userData = useDataUser();
  const { checkStaff } = useCheckingStaff({
    role: userData ? userData.role : "User",
  });
  useEffect(() => {
    if (!themeId) {
      return;
    }
    const themeIdLocal = localStorage.getItem("themeId");
    const pageNumberLocal = localStorage.getItem("pageNumber");
    if (themeIdLocal !== themeId) {
      setPageNumber(0);
      localStorage.setItem("themeId", themeId);
    } else if (!isNaN(Number(pageNumberLocal))) {
      setPageNumber(Number(pageNumberLocal));
    }
  }, [themeId]);
  useEffect(() => {
    if (!themeId) {
      return;
    }
    localStorage.setItem("pageNumber", String(pageNumber));
    if (pageNumber !== Number(localStorage.getItem("pageNumber"))) {
      return;
    } else {
      setLoading(async () => {
        const req = await fetch("/api/categories/getMessages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            themeId: themeId,
            subCategoryId: subCategoryId,
            pageNumber: pageNumber,
          }),
        });
        const res = await req.json();
        if (res.ok) {
          setMessages(res.data);
          setSubCat(res.subCat);
        } else {
          setMessage(`Ошибка: ${res.error}`);
          setIsNotify(true);
        }
      });
      window.scrollTo({
        top: 0,
      });
    }
  }, [pageNumber]);
  const [pending, setPending] = React.useTransition();
  if (!messages) {
    return null;
  }
  if (
    !themeId ||
    !subCategoryId ||
    !messages ||
    (typeof params.id === "string" &&
      messages.length > 0 &&
      messages[0].Posts.title !== decodeURIComponent(params.id))
  ) {
    return (
      <div className="grow flex items-center">
        <p className="font-medium text-neutral-900 dark:text-neutral-100 text-lg">
          Ошибка: 404 :(
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col min-h-screen max-w-300 w-full gap-5">
      {subCat && (
        <Link
          href={`/subCategories/${decodeURIComponent(
            subCat.title
          )}?subCategory=${subCat.id}`}
          className="font-medium text-neutral-700 dark:text-neutral-300 max-w-max"
        >
          Назад
        </Link>
      )}
      <HeaderThemes messages={messages} />
      {totalPages > 1 && (
        <div className="border border-neutral-300 dark:border-neutral-700 w-full p-2.5 rounded-md bg-white dark:bg-[#212121]">
          {typeof pageNumber === "number" && (
            <Pagination
              id="up"
              pageNumber={pageNumber}
              setPageNumber={
                setPageNumber as React.Dispatch<React.SetStateAction<number>>
              }
              totalPages={totalPages}
              count={messages ? messages[0].Posts._count.MessagesPosts : 0}
            />
          )}
        </div>
      )}
      <div className="flex flex-col gap-5">
        {messages.map((message) => {
          return (
            <CardMessageTheme
              setPending={setPending}
              setChangeParent={setChange}
              key={message.id}
              props={message}
              refEditor={editorRef}
              pending={pending}
              setMessages={setMessages}
            />
          );
        })}
      </div>
      <ChooseContentAnswer
        change={change}
        messages={messages}
        pageNumber={pageNumber}
        editorRef={editorRef}
        pending={pending}
        setPending={setPending}
        setMessages={setMessages}
        setPageNumber={setPageNumber}
      />
      {totalPages > 1 && (
        <div className="border border-neutral-300 dark:border-neutral-700 w-full p-2.5 rounded-md bg-white dark:bg-[#212121]">
          {typeof pageNumber === "number" && (
            <Pagination
              id="down"
              pageNumber={pageNumber}
              setPageNumber={
                setPageNumber as React.Dispatch<React.SetStateAction<number>>
              }
              totalPages={totalPages}
              count={messages ? messages[0].Posts._count.MessagesPosts : 0}
            />
          )}
        </div>
      )}
      {checkStaff && (
        <LockedUnlockedButton
          locked={messages.length > 0 && messages[0].Posts.locked}
          setMessages={setMessages}
        />
      )}
    </div>
  );
}
