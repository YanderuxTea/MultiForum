import Link from "next/link";
import { ISearchChats } from "./SearchContent";
import AvatarUser from "../users/AvatarUser";
import ColorNicknameUser from "../users/ColorNicknameUser";
import React, { RefObject } from "react";

export default function CardFoundUser({
  props,
  targetRef,
  setQuery,
  setIsActiveSearch,
  refSearch,
}: {
  refSearch: RefObject<HTMLInputElement | null>;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsActiveSearch: React.Dispatch<React.SetStateAction<boolean>>;
  props: ISearchChats;
  targetRef?: (node: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={targetRef}
      className="select-none bg-white dark:bg-[#212121] flex transition-colors duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-[#313131]"
    >
      <Link
        onClick={() => {
          setQuery("");
          setIsActiveSearch(false);
          refSearch.current?.blur();
        }}
        href={`/messenger?chatId=${props.Chats.length > 0 ? props.Chats[0].id : `recent`}&login=${props.login}`}
        className="p-2.5 grow flex flex-row items-center gap-2.5"
      >
        <AvatarUser
          props={{
            role: props.role,
            avatar: props.avatar || undefined,
            width: 40,
            height: 40,
          }}
        />
        <ColorNicknameUser
          user={{ role: props.role, login: props.login }}
          fontSize={16}
          fontWeight={600}
        />
      </Link>
    </div>
  );
}
