import { EditorContent, generateText, useEditor } from "@tiptap/react";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Youtube from "@tiptap/extension-youtube";
import Image from "@tiptap/extension-image";

import Link from "next/link";
import ColorNicknameUser from "@/components/shared/users/ColorNicknameUser";
import useDeclinationWord from "@/hooks/useDeclinationWord";
import ClockIcon from "@/components/shared/icons/ClockIcon";
import MessageCircleIcon from "@/components/shared/icons/MessageCircleIcon";
import AvatarUser from "@/components/shared/users/AvatarUser";
import SmallLockIcon from "@/components/shared/icons/SmallLockIcon";
import { IProfileMessage } from "@/app/api/getActivityProfile/route";
import React from "react";
import PreviewReaction from "@/components/shared/PreviewReaction";
import { AnimatePresence } from "framer-motion";
import OpenMenuAdminsPanelProvider from "@/components/providers/OpenMenuAdminsPanelProvider";
import MenuWindow from "../menus/MenuWindow";
import ContentMenuReaction from "@/components/shared/themes/ContentMenuReaction";
import { ReactionType } from "@/context/CategoriesContext";
export default function MessageCardUser({
  props,
  role,
  avatar,
  login,
}: {
  props: IProfileMessage;
  role: string;
  avatar: string | null;
  login: string;
}) {
  const rawText = generateText(props.text, [
    StarterKit,
    TextStyle,
    Youtube,
    Image,
  ]);
  const text =
    rawText.length > 400 ? rawText.slice(0, 400).trimEnd() + "..." : rawText;
  const viewer = useEditor({
    extensions: [Text, Document.extend({ content: "text*" })],
    content: text,
    editable: false,
    immediatelyRender: false,
  });
  const countAnswer = props.Posts._count.MessagesPosts - 1;
  const reactionsByType = React.useMemo(() => {
    return props.reactions.reduce(
      (acc, curr) => {
        acc[curr.reactionType] = acc[curr.reactionType] + 1;
        return acc;
      },
      { up: 0, down: 0, like: 0 }
    );
  }, [props.reactions]);
  const usersByReaction = React.useMemo(() => {
    const grouped = props.reactions.reduce<
      Record<
        ReactionType,
        {
          login: string;
          avatar: string | null;
          id: string;
          role: string;
          createdAt: Date;
          reactionType: ReactionType;
        }[]
      >
    >(
      (acc, curr) => {
        acc[curr.reactionType].push({
          login: curr.fromUser.login,
          avatar: curr.fromUser.avatar,
          id: curr.fromUser.id,
          role: curr.fromUser.role,
          createdAt: curr.createdAt,
          reactionType: curr.reactionType,
        });
        return acc;
      },
      {
        up: [],
        down: [],
        like: [],
      }
    );
    (Object.keys(grouped) as ReactionType[]).forEach((type) => {
      grouped[type].sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    });
    return grouped;
  }, [props.reactions]);
  const [isOpenReactionMenu, setIsOpenReactionMenu] =
    React.useState<boolean>(false);
  return (
    <div className="p-2.5 flex flex-col gap-5 overflow-clip w-full">
      <OpenMenuAdminsPanelProvider>
        <AnimatePresence>
          {isOpenReactionMenu && (
            <MenuWindow
              props={{
                setIsOpenMenu: setIsOpenReactionMenu,
                isOpenMenu: isOpenReactionMenu,
                content: (
                  <ContentMenuReaction
                    props={{
                      up: usersByReaction.up,
                      down: usersByReaction.down,
                      like: usersByReaction.like,
                    }}
                  />
                ),
              }}
            />
          )}
        </AnimatePresence>
      </OpenMenuAdminsPanelProvider>

      <div className="flex flex-row items-center gap-2.5">
        <div className="hidden lg:block">
          <AvatarUser
            props={{
              role: role,
              avatar: avatar ?? undefined,
              width: 40,
              height: 40,
            }}
          />
        </div>
        <div className="flex flex-col w-[90%]">
          <span className="flex flex-row items-center gap-1.25 w-[70%] ">
            {props.Posts.locked && <SmallLockIcon />}
            <Link
              href={`/theme/${props.Posts.title}?themeId=${props.Posts.id}&subCategoryId=${props.Posts.SubCategories.id}`}
              className="transition-colors duration-300 ease-out hover:text-blue-500 dark:hover:text-blue-600 break-all block font-medium text-neutral-800 dark:text-neutral-200 text-xl max-w-max"
            >
              {props.Posts.title}
            </Link>
          </span>
          <span
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 
          w-[80%]"
          >
            <ColorNicknameUser
              user={{ role: role, login: login }}
              fontSize={14}
              fontWeight={500}
            />{" "}
            написал в раздел{" "}
            <Link
              href={`/subCategories/${props.Posts.SubCategories.title}?subCategory=${props.Posts.SubCategories.id}`}
              className="transition-colors duration-300 ease-out hover:text-blue-500 dark:hover:text-blue-600 text-neutral-800 dark:text-neutral-200"
            >
              {props.Posts.SubCategories.title}
            </Link>
          </span>
        </div>
      </div>
      <EditorContent
        editor={viewer}
        className="text-sm wrap-break-word max-h-25 line-clamp-5 lg:pl-12.5"
      />
      <div className="flex lg:hidden  justify-end">
        <PreviewReaction
          setIsOpenReactionMenu={setIsOpenReactionMenu}
          isOpenReactionMenu={isOpenReactionMenu}
          up={reactionsByType.up}
          like={reactionsByType.like}
          down={reactionsByType.down}
        />
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium flex flex-row items-center gap-5 lg:pl-12.5">
          <span className="flex flex-row items-center gap-1.25">
            <ClockIcon />
            {Intl.DateTimeFormat("ru-RU", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })
              .format(new Date(props.createdAt))
              .replace("г.", "")}
          </span>
          <span className="flex flex-row items-center gap-1.25">
            <MessageCircleIcon />
            {countAnswer}{" "}
            {useDeclinationWord(countAnswer, ["ответ", "ответа", "ответов"])}
          </span>
        </p>
        <div className="hidden lg:block">
          <PreviewReaction
            setIsOpenReactionMenu={setIsOpenReactionMenu}
            isOpenReactionMenu={isOpenReactionMenu}
            up={reactionsByType.up}
            like={reactionsByType.like}
            down={reactionsByType.down}
          />
        </div>
      </div>
    </div>
  );
}
