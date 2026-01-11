import Link from "next/link";
import AvatarUser from "../users/AvatarUser";
import { ILastThemes } from "./BlockAdditionalInformation";
import useTimeAgo from "@/hooks/useTimeAgo";
import ClockIcon from "../icons/ClockIcon";
import ColorNicknameUser from "../users/ColorNicknameUser";
import useDeclinationWord from "@/hooks/useDeclinationWord";

export default function ThemeCard({ props }: { props: ILastThemes }) {
  return (
    <div className="p-2.5 flex flex-row gap-2.5 items-center w-full">
      <div className="shrink-0">
        <AvatarUser
          props={{
            role: props.MessagesPosts[0].Users.role,
            avatar: props.MessagesPosts[0].Users.avatar ?? undefined,
            width: 32,
            height: 32,
          }}
        />
      </div>
      <div className="flex flex-col gap-0.5 text-left w-full">
        <Link
          href={`/theme/${props.title}?themeId=${props.id}&subCategoryId=${props.SubCategories.id}`}
          className="max-w-max hover:text-blue-500 dark:hover:text-blue-600 text-neutral-800 dark:text-neutral-200 font-medium transition-colors duration-300 ease-out text-sm break-all"
        >
          {props.title}
        </Link>
        <p className="text-neutral-800 dark:text-neutral-200 text-sm font-medium break-all"></p>
        <div className="flex flex-row gap-1.25 items-center w-full">
          <span className="items-center text-sm font-medium block w-full">
            <Link href={`/profile/${props.MessagesPosts[0].Users.login}`}>
              <ColorNicknameUser
                user={{
                  role: props.MessagesPosts[0].Users.role,
                  login: props.MessagesPosts[0].Users.login,
                }}
                fontSize={14}
                fontWeight={500}
              />
            </Link>{" "}
            создана {useTimeAgo(props.createdAt)}
          </span>
        </div>
      </div>
      <div className="shrink-0 w-8 aspect-square bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center rounded-full group relative">
        <p className="font-medium select-none">
          {props._count.MessagesPosts - 1}
        </p>
        <div className="absolute hidden group-hover:flex select-none text-[12px] bg-white dark:bg-[#212121] border flex-row p-1.25 -translate-y-10 rounded-md border-neutral-300 dark:border-neutral-700">
          <p className="block">
            {props._count.MessagesPosts - 1}{" "}
            {useDeclinationWord(props._count.MessagesPosts - 1, [
              "ответ",
              "ответа",
              "ответов",
            ])}
          </p>
        </div>
      </div>
    </div>
  );
}
