import { IMessage } from "@/context/CategoriesContext";
import AvatarUser from "@/components/shared/users/AvatarUser";
import ColorNicknameUser from "@/components/shared/users/ColorNicknameUser";
import CheckNameplateUser from "@/components/shared/users/CheckNameplateUser";
import Link from "next/link";
import useCurrentWidth from "@/hooks/useCurrentWidth";
import React, { RefObject } from "react";
import { Editor } from "@tiptap/core";
import useDataUser from "@/hooks/useDataUser";
import TrashIcon from "@/components/shared/icons/TrashIcon";
import useCheckingStaff from "@/hooks/useCheckingStaff";
import useDeleteMessages from "@/hooks/useDeleteMessages";
import ContentNotChange from "@/components/shared/themes/ContentNotChange";
import ContentChangeMessage from "@/components/shared/themes/ContentChangeMessage";

export default React.memo(function CardMessageTheme({
  props,
  refEditor,
  pending,
  setMessages,
  setChangeParent,
  setPending,
}: {
  props: IMessage;
  refEditor: RefObject<Editor | null>;
  pending: boolean;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | undefined>>;
  setChangeParent: React.Dispatch<React.SetStateAction<boolean>>;
  setPending: React.TransitionStartFunction;
}) {
  const currentWidth = useCurrentWidth();
  const convertedDate = Intl.DateTimeFormat("ru-RU", { dateStyle: "long" })
    .format(new Date(props.createdAt))
    .replace("г.", "");
  const userData = useDataUser();
  const { isAdmin } = useCheckingStaff({ role: userData?.role || "User" });
  const deleteMessages = useDeleteMessages({
    props: props,
    setMessages: setMessages,
  });
  const [change, setChange] = React.useState<boolean>(false);
  return (
    <div className="flex flex-col lg:flex-row bg-white dark:bg-[#212121] border border-neutral-300 dark:border-neutral-700 rounded-md">
      {!change && (
        <div className="flex flex-row lg:flex-col items-center gap-2.5 p-2.5 break-all w-full lg:w-70">
          <AvatarUser
            props={{
              avatar: props.Users.avatar ?? undefined,
              role: props.Users.role,
              width: currentWidth < 1024 ? 40 : 100,
              height: currentWidth < 1024 ? 40 : 100,
            }}
          />
          <div className="flex flex-col relative w-full lg:text-center">
            {isAdmin && (
              <button
                onClick={pending ? undefined : () => deleteMessages()}
                className="absolute right-0 cursor-pointer lg:hidden"
              >
                <TrashIcon />
              </button>
            )}
            <Link href={`/profile/${props.Users.login}`}>
              <ColorNicknameUser
                user={{ role: props.Users.role, login: props.Users.login }}
                fontSize={currentWidth < 1024 ? 16 : 18}
                fontWeight={600}
              />
            </Link>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium lg:hidden">
              Опубликовано: {convertedDate}
            </p>
          </div>
          <div className="hidden lg:flex flex-col items-center gap-2.5">
            <CheckNameplateUser role={props.Users.role} />
            <p className="text-neutral-600 dark:text-neutral-400 font-medium">
              Сообщений: {props.Users._count.MessagesPosts}
            </p>
          </div>
        </div>
      )}
      {change ? (
        <ContentChangeMessage
          setMessages={setMessages}
          pending={pending}
          setPending={setPending}
          props={props}
          setChangeParent={setChangeParent}
          setChange={setChange}
        />
      ) : (
        <ContentNotChange
          props={props}
          pending={pending}
          convertedDate={convertedDate}
          refEditor={refEditor}
          setMessages={setMessages}
          setChange={setChange}
          setChangeParent={setChangeParent}
        />
      )}
    </div>
  );
});
