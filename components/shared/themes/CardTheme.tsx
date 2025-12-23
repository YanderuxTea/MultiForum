"use client";
import { IPost, IPosts } from "@/context/CategoriesContext";
import Link from "next/link";
import useDataUser from "@/hooks/useDataUser.ts";
import PinnedIcon from "@/components/shared/icons/PinnedIcon.tsx";
import ColorNicknameUser from "@/components/shared/users/ColorNicknameUser.tsx";
import SmallLockIcon from "@/components/shared/icons/SmallLockIcon.tsx";
import useNotify from "@/hooks/useNotify.ts";
import React from "react";
import useDeclinationWord from "@/hooks/useDeclinationWord.ts";
import AvatarUser from "@/components/shared/users/AvatarUser.tsx";
import useTimeAgo from "@/hooks/useTimeAgo.ts";

export default function CardTheme({
  props,
  subId,
  setThemesAction,
}: {
  props: IPost;
  subId: string;
  setThemesAction: React.Dispatch<React.SetStateAction<IPosts | undefined>>;
}) {
  const userData = useDataUser();
  const answerText = useDeclinationWord(props._count.MessagesPosts, [
    "ответ",
    "ответа",
    "ответов",
  ]);
  const { setMessage, setIsNotify } = useNotify();
  async function pinnedUnpinnedTheme() {
    const req = await fetch("/api/posts/pinnedUnpinnedTheme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: props.id, pin: !props.pinned }),
    });
    const res = await req.json();
    if (res.ok) {
      setThemesAction((prevState) => {
        if (!prevState) return prevState;
        return {
          ...prevState,
          posts: prevState.posts.map((post) => {
            if (post.id !== props.id) {
              return post;
            }
            return {
              ...post,
              pinned: !post.pinned,
            };
          }),
        };
      });
    } else {
      setMessage(res.error);
      setIsNotify(true);
    }
  }
  return (
    <div className="flex flex-row items-center gap-2.5 p-2.5 justify-between">
      <div className="flex flex-col min-w-0 gap-1.25 w-[80%]">
        <div className="flex flex-row gap-1.25 items-center">
          {props.pinned ? (
            <div
              className={`bg-orange-500 dark:bg-orange-600 p-1.25 rounded-full ${
                userData?.role === "Admin" && "cursor-pointer"
              }`}
              onClick={
                userData?.role === "Admin"
                  ? () => pinnedUnpinnedTheme()
                  : undefined
              }
            >
              <PinnedIcon />
            </div>
          ) : (
            userData?.role === "Admin" && (
              <button
                className="cursor-pointer"
                onClick={
                  userData.role === "Admin"
                    ? () => pinnedUnpinnedTheme()
                    : undefined
                }
              >
                <PinnedIcon adm={true} />
              </button>
            )
          )}
          {props.locked && (
            <div>
              <SmallLockIcon />
            </div>
          )}
          <Link
            className="transition-colors duration-300 ease-out truncate font-bold text-neutral-900 dark:text-neutral-100 hover:text-blue-500 dark:hover:text-blue-600 max-w-max"
            href={`/theme/${props.title}?themeId=${props.id}&subCategoryId=${subId}`}
          >
            {props.title}
          </Link>
        </div>
        <span className="flex flex-col gap-1.25 text-[13px] text-neutral-600 dark:text-neutral-400 items-start font-medium">
          <div className="flex flex-row gap-1.25 flex-wrap">
            <p>Автор:</p>
            <Link href={`/profile/${props.user.login}`}>
              <ColorNicknameUser
                user={{ login: props.user.login, role: props.user.role }}
                fontSize={13}
                fontWeight={500}
              />
            </Link>
            <p>
              {Intl.DateTimeFormat("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
                .format(new Date(props.createdAt))
                .replace("г.", "")}
            </p>
          </div>
          <div>
            <p className="lg:hidden">
              {props._count.MessagesPosts} {answerText}
            </p>
          </div>
        </span>
      </div>
      <div className="w-[25%] justify-center flex items-center gap-2.5 lg:w-[30%]">
        <p className="hidden lg:block text-neutral-600 dark:text-neutral-400 font-medium w-[30%]">
          {props._count.MessagesPosts} {answerText}
        </p>
        <Link
          href={`/profile/${props.MessagesPosts[0].Users.login}`}
          className="break-all flex flex-col text-center gap-1.25 items-center lg:flex-row lg:gap-2.5 lg:w-[70%]"
        >
          <AvatarUser
            props={{
              role: props.MessagesPosts[0].Users.role,
              avatar: props.MessagesPosts[0].Users.avatar ?? undefined,
              width: 40,
              height: 40,
            }}
          />
          <span className="hidden lg:flex items-start flex-col w-[90%]">
            <ColorNicknameUser
              user={{
                role: props.MessagesPosts[0].Users.role,
                login: props.MessagesPosts[0].Users.login,
              }}
              fontSize={14}
              fontWeight={500}
            />
            <p className="text-[14px] font-medium text-neutral-700 dark:text-neutral-300 hidden lg:block">
              {useTimeAgo(props.MessagesPosts[0].createdAt)}
            </p>
          </span>
          <p className="text-[11px] font-medium text-neutral-700 dark:text-neutral-300 lg:hidden">
            {useTimeAgo(props.MessagesPosts[0].createdAt).replace("назад", "")}
          </p>
        </Link>
      </div>
    </div>
  );
}
