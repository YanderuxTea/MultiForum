import { EditorContent } from "@tiptap/react";
import useCheckingStaff from "@/hooks/useCheckingStaff";
import useViewer from "@/hooks/useViewer";
import { IMessage } from "@/context/CategoriesContext";
import useDataUser from "@/hooks/useDataUser";
import TrashIcon from "@/components/shared/icons/TrashIcon";
import useDeleteMessages from "@/hooks/useDeleteMessages";
import BlockquoteButton from "@/components/shared/buttons/BlockquoteButton";
import React, { RefObject } from "react";
import { Editor } from "@tiptap/core";
import { AnimatePresence } from "framer-motion";
import MenuWindow from "@/components/ui/menus/MenuWindow";
import ContentMenuHistory from "@/components/shared/themes/ContentMenuHistory";
import OpenMenuAdminsPanelProvider from "@/components/providers/OpenMenuAdminsPanelProvider";
import ChoiceReaction from "../ChoiceReaction";
import PreviewReaction from "../PreviewReaction";

export default function ContentNotChange({
  props,
  pending,
  convertedDate,
  refEditor,
  setMessages,
  setChange,
  setChangeParent,
  countReactions,
  setIsOpenReactionMenu,
  isOpenReactionMenu,
}: {
  isOpenReactionMenu: boolean;
  setIsOpenReactionMenu: React.Dispatch<React.SetStateAction<boolean>>;
  countReactions: { down: number; up: number; like: number };
  props: IMessage;
  pending: boolean;
  convertedDate: string;
  refEditor: RefObject<Editor | null>;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | undefined>>;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  setChangeParent: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const userData = useDataUser();
  const { isAdmin, checkStaff } = useCheckingStaff({
    role: userData?.role || "User",
  });

  const viewer = useViewer({ text: props.text });
  const deleteMessages = useDeleteMessages({
    props: props,
    setMessages: setMessages,
  });
  const [isOpenMenu, setIsOpenMenu] = React.useState<boolean>(false);
  const choiceReaction =
    props.reactions.find((reaction) => {
      if (reaction.fromUser.id === userData?.id) {
        return reaction;
      }
    }) ?? null;
  return (
    <div className="w-full p-2.5 flex flex-col gap-2.5 relative break">
      <AnimatePresence>
        {checkStaff && isOpenMenu && (
          <OpenMenuAdminsPanelProvider>
            <MenuWindow
              props={{
                content: <ContentMenuHistory id={props.id} />,
                isOpenMenu: isOpenMenu,
                setIsOpenMenu: setIsOpenMenu,
              }}
            />
          </OpenMenuAdminsPanelProvider>
        )}
      </AnimatePresence>

      {isAdmin && (
        <button
          onClick={pending ? undefined : () => deleteMessages()}
          className="absolute right-2.5 cursor-pointer hidden lg:block"
        >
          <TrashIcon />
        </button>
      )}
      <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium hidden lg:block">
        Опубликовано: {convertedDate}
      </p>
      <EditorContent editor={viewer} className="grow min-h-35" />
      {props.HistoryMessage.length > 0 && (
        <p className="font-medium text-neutral-600 dark:text-neutral-400 text-sm mt-2.5">
          Изменено:{" "}
          {Intl.DateTimeFormat("ru-RU", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
          })
            .format(new Date(props.HistoryMessage[0].updateAt))
            .replace("г.", "")}
        </p>
      )}
      <div
        className={`flex flex-col gap-2.5 ${
          !props.Posts.locked &&
          userData?.verifyAdm === "Yes" &&
          "border-t border-neutral-300 dark:border-neutral-700 pt-2.5"
        } ${
          checkStaff &&
          props.HistoryMessage.length > 0 &&
          "border-t border-neutral-300 dark:border-neutral-700 pt-2.5"
        } ${
          userData?.verifyAdm === "Yes" &&
          userData.id !== props.idUser &&
          "border-t border-neutral-300 dark:border-neutral-700 pt-2.5"
        }
        ${
          (countReactions.down > 0 ||
            countReactions.like > 0 ||
            countReactions.up) &&
          "border-t border-neutral-300 dark:border-neutral-700 pt-2.5"
        }`}
      >
        {!props.Posts.locked && userData?.verifyAdm === "Yes" && (
          <div className="flex flex-col gap-2.5">
            <BlockquoteButton
              refEditor={refEditor}
              pending={pending}
              props={props}
              convertedDate={convertedDate}
            />
            {userData?.id === props.idUser && (
              <button
                className="cursor-pointer text-neutral-600 dark:text-neutral-400 font-medium max-w-max"
                onClick={() => {
                  setChange((prevState) => !prevState);
                  setChangeParent((prevState) => !prevState);
                }}
              >
                Изменить
              </button>
            )}
          </div>
        )}

        {checkStaff && props.HistoryMessage.length > 0 && (
          <button
            onClick={() => setIsOpenMenu(true)}
            className="cursor-pointer text-neutral-600 dark:text-neutral-400 font-medium max-w-max"
          >
            История
          </button>
        )}
      </div>
      {(countReactions.down > 0 ||
        countReactions.like > 0 ||
        countReactions.up > 0) && (
        <div className="flex justify-end">
          <PreviewReaction
            isOpenReactionMenu={isOpenReactionMenu}
            setIsOpenReactionMenu={setIsOpenReactionMenu}
            down={countReactions.down}
            like={countReactions.like}
            up={countReactions.up}
          />
        </div>
      )}
      {userData?.id !== props.idUser && userData?.verifyAdm === "Yes" && (
        <div className="flex items-end justify-end">
          <ChoiceReaction
            toUserId={props.idUser}
            setMessages={setMessages}
            messageId={props.id}
            choice={choiceReaction}
          />
        </div>
      )}
    </div>
  );
}
