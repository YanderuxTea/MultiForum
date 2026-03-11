import { INotification } from "@/components/providers/NotifyProvider.tsx";
import { ReactionType } from "@/prisma/generated/enums.ts";
import ColorNicknameUser from "@/components/shared/users/ColorNicknameUser.tsx";
import Link from "next/link";
import ArrowReaction from "@/components/shared/icons/ArrowReaction.tsx";
import HeartReaction from "@/components/shared/icons/HeartReaction.tsx";
import { ranks } from "@/data/ranksData.ts";
import Image from "next/image";
import SmallLockIcon from "@/components/shared/icons/SmallLockIcon.tsx";
import MessageNotifyIcon from "@/components/shared/icons/MessageNotifyIcon.tsx";
import MessageInThemeIcon from "@/components/shared/icons/MessageInThemeIcon.tsx";

type IAnswer = {
  loginSender: string;
  roleSender: string;
  themeId: string;
  themeTitle: string;
  idSubCat: string;
};
type IClose = {
  loginCloser: string;
  roleCloser: string;
  themeId: string;
  themeTitle: string;
  idSubCat: string;
};
type IMessage = {
  loginSender: string;
};
type IReaction = {
  loginSender: string;
  reactionType: ReactionType;
  roleSender: string;
  themeId: string;
  themeTitle: string;
  idSubCat: string;
};
type IRank = {
  rankLvl: number;
};

export default function CardNotifyCenter({
  props,
  isFirst,
  timeFormatter,
}: {
  timeFormatter: (date: Date) => string;
  props: INotification;
  isFirst: boolean;
}) {
  const convertedDate = timeFormatter(props.createdAt);
  const renderContent = (props: INotification) => {
    switch (props.typeNotify) {
      case "answer": {
        const data = props.metaData as IAnswer;
        const { loginSender, roleSender, themeTitle, themeId, idSubCat } = data;
        return (
          <div
            className={`transition-colors duration-300 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-800 group p-2.5 flex flex-row w-full relative border-neutral-300 dark:border-neutral-700 text-[15px] text-neutral-700 dark:text-neutral-300/75 text-justify ${!isFirst && "border-t"} `}
          >
            <p className={"inline-block"}>
              <span className={"inline-flex align-middle"}>
                <MessageInThemeIcon />
              </span>{" "}
              В вашу тему{" "}
              <Link
                href={`/theme/${themeTitle}?themeId=${themeId}&subCategoryId=${idSubCat}`}
                className={
                  "font-medium text-neutral-800 dark:text-neutral-200 transition-colors duration-300" +
                  " ease-out hover:text-blue-500 dark:hover:text-blue-600"
                }
              >
                «{themeTitle}»
              </Link>{" "}
              ответил пользователь{" "}
              <Link href={`/profile/${loginSender}`}>
                <ColorNicknameUser
                  user={{ role: roleSender, login: loginSender }}
                  fontSize={15}
                  fontWeight={600}
                />
              </Link>
            </p>
            <span
              className={
                "absolute top-2.5 right-2.5 text-[12px] text-neutral-500 dark:text-neutral-400" +
                " group-hover:text-neutral-800 dark:group-hover:text-neutral-300 transition-colors duration-300" +
                " ease-out"
              }
            >
              {convertedDate}
            </span>
            <div className={"pl-5 invisible text-[12px]"}>{convertedDate}</div>
          </div>
        );
      }
      case "close": {
        const data = props.metaData as IClose;
        const { loginCloser, roleCloser, themeTitle, themeId, idSubCat } = data;
        return (
          <div
            className={`transition-colors duration-300 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-800 group relative p-2.5 w-full select-none border-neutral-300 dark:border-neutral-700 text-[15px] text-neutral-700 dark:text-neutral-300/75 text-justify flex flex-row ${!isFirst && "border-t"} `}
          >
            <p className={"inline-block"}>
              <span className={"align-middle inline-flex shrink-0"}>
                <SmallLockIcon />
              </span>{" "}
              <span className={"font-medium"}>
                {roleCloser === "Admin" ? "Администратор" : "Модератор"}{" "}
              </span>
              <Link href={`/profile/${loginCloser}`}>
                <ColorNicknameUser
                  user={{ login: loginCloser, role: roleCloser }}
                  fontSize={15}
                  fontWeight={600}
                />{" "}
              </Link>{" "}
              закрыл вашу тему{" "}
              <Link
                href={`/theme/${themeTitle}?themeId=${themeId}&subCategoryId=${idSubCat}`}
                className={
                  "font-medium text-neutral-900 dark:text-neutral-100 transition-colors duration-300" +
                  " ease-out hover:text-blue-500 dark:hover:text-blue-600"
                }
              >
                «{themeTitle}»
              </Link>{" "}
            </p>
            <span
              className={
                "absolute top-2.5 right-2.5 text-[12px] text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-800 dark:group-hover:text-neutral-300 transition-colors duration-300" +
                " ease-out"
              }
            >
              {convertedDate}
            </span>
            <div className={"pl-5 invisible text-[12px]"}>{convertedDate}</div>
          </div>
        );
      }
      case "message": {
        const data = props.metaData as IMessage;
        const { loginSender } = data;
        return (
          <div
            className={`transition-colors duration-300 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-800 group p-2.5 w-full select-none border-neutral-300 dark:border-neutral-700 text-[15px] text-neutral-700 dark:text-neutral-300/75 text-justify flex flex-row relative ${!isFirst && "border-t"} `}
          >
            <p className={"inline-block"}>
              <span className={"inline-flex align-middle"}>
                <MessageNotifyIcon />
              </span>{" "}
              У вас новое сообщение в мессенджере от пользователя{" "}
              <Link
                href={`/profile/${loginSender}`}
                className={
                  "font-semibold text-neutral-900 dark:text-neutral-100"
                }
              >
                {loginSender}
              </Link>
            </p>
            <span
              className={
                "absolute top-2.5 right-2.5 text-[12px] text-neutral-500 dark:text-neutral-400  group-hover:text-neutral-800 dark:group-hover:text-neutral-300 transition-colors duration-300" +
                " ease-out"
              }
            >
              {convertedDate}
            </span>
            <div className={"pl-5 invisible text-[12px]"}>{convertedDate}</div>
          </div>
        );
      }
      case "reaction": {
        const data = props.metaData as IReaction;
        const {
          loginSender,
          roleSender,
          themeTitle,
          themeId,
          reactionType,
          idSubCat,
        } = data;
        const reactionIcon =
          reactionType === "down" || reactionType === "up" ? (
            <ArrowReaction />
          ) : (
            <HeartReaction />
          );
        const color =
          reactionType === "down"
            ? "bg-[#EB4848] dark:bg-[#E02E2E]"
            : reactionType === "like"
              ? "bg-[#F76700] dark:bg-[#FF6524]"
              : "rotate-180 bg-[#289E67] dark:bg-[#008849]";
        return (
          <div
            className={`transition-colors duration-300 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-800 group p-2.5 w-full select-none border-neutral-300 dark:border-neutral-700 text-[15px] text-neutral-700 dark:text-neutral-300/75 text-justify flex flex-row relative ${!isFirst && "border-t"} `}
          >
            <p className={"inline-block"}>
              <span
                className={`${color} inline-flex p-1.25 rounded-full align-middle`}
              >
                {reactionIcon}
              </span>{" "}
              Пользователь{" "}
              <Link href={`/profile/${loginSender}`}>
                <ColorNicknameUser
                  user={{ role: roleSender, login: loginSender }}
                  fontSize={15}
                  fontWeight={600}
                />
              </Link>{" "}
              поставил реакцию на ваше сообщение в теме{" "}
              <Link
                href={`/theme/${themeTitle}?themeId=${themeId}&subCategoryId=${idSubCat}`}
                className={
                  "font-medium text-neutral-800 dark:text-neutral-200 transition-colors duration-300" +
                  " ease-out hover:text-blue-500 dark:hover:text-blue-600"
                }
              >
                «{themeTitle}»
              </Link>{" "}
            </p>
            <span
              className={
                "absolute top-2.5 right-2.5 text-[12px] text-neutral-500 dark:text-neutral-400  group-hover:text-neutral-800 dark:group-hover:text-neutral-300 transition-colors duration-300" +
                " ease-out"
              }
            >
              {convertedDate}
            </span>
            <div className={"pl-5 invisible text-[12px]"}>{convertedDate}</div>
          </div>
        );
      }
      case "rank": {
        const data = props.metaData as IRank;
        const { rankLvl } = data;
        const rank = ranks.find((r) => r.lvl === rankLvl);
        return (
          <div
            className={`transition-colors duration-300 ease-out hover:bg-neutral-100 dark:hover:bg-neutral-800 group p-2.5 w-full select-none border-neutral-300 dark:border-neutral-700 text-[15px] text-neutral-700 dark:text-neutral-300/75 text-justify flex-row flex relative ${!isFirst && "border-t"} `}
          >
            <p className={"inline-block"}>
              <span className={"text-neutral-800 dark:text-neutral-200"}>
                Поздравляем!
              </span>{" "}
              Вы достигли ранга{" "}
              <span
                className={
                  "inline-flex items-center gap-1.25 font-semibold align-middle text-neutral-900 dark:text-neutral-200"
                }
              >
                {rank?.title}{" "}
                <Image
                  draggable={"false"}
                  src={rank?.icon || ""}
                  alt={"rank"}
                />
              </span>
            </p>
            <span
              className={
                "absolute top-2.5 right-2.5 text-[12px] text-neutral-500 dark:text-neutral-400  group-hover:text-neutral-800 dark:group-hover:text-neutral-300 transition-colors duration-300" +
                " ease-out"
              }
            >
              {convertedDate}
            </span>
            <div className={"pl-5 invisible text-[12px]"}>{convertedDate}</div>
          </div>
        );
      }
    }
  };
  return renderContent(props);
}
