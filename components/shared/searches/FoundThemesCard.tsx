import { IThemesSearch } from "@/app/api/searchUsersThemes/route";
import Link from "next/link";
import ColorNicknameUser from "../users/ColorNicknameUser";
import { generateText } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Youtube from "@tiptap/extension-youtube";
import Image from "@tiptap/extension-image";
import { EditorContent, useEditor } from "@tiptap/react";
import Document from "@tiptap/extension-document";
import Text from "@tiptap/extension-text";
import ClockIcon from "../icons/ClockIcon";
import MessageCircleIcon from "../icons/MessageCircleIcon";
import useDeclinationWord from "@/hooks/useDeclinationWord";
import SmallLockIcon from "../icons/SmallLockIcon";
import AvatarUser from "../users/AvatarUser";

export default function FoundThemesCard({ theme }: { theme: IThemesSearch }) {
  const rawText = generateText(theme.MessagesPosts[0].text, [
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
  return (
    <div className="p-2.5 flex flex-col gap-2.5 ">
      <div className="flex flex-row gap-2.5 items-center">
        <div className="hidden lg:block">
          <AvatarUser
            props={{
              role: theme.user.role,
              avatar: theme.user.avatar ?? undefined,
              width: 40,
              height: 40,
            }}
          />
        </div>
        <div className="w-[90%] flex flex-col">
          <div className="flex flex-row gap-1.25 items-center">
            {theme.locked && <SmallLockIcon />}
            <Link
              href={`/theme/${theme.title}?themeId=${theme.id}&subCategoryId=${theme.SubCategories.id}`}
              className="transition-colors duration-300 ease-out hover:text-blue-500 dark:hover:text-blue-600 truncate block font-medium text-neutral-800 dark:text-neutral-200 max-w-[90%]"
            >
              {theme.title}
            </Link>
          </div>
          <span className="block truncate text-sm font-medium text-neutral-700 dark:text-neutral-300">
            Автор:{" "}
            <Link href={`/profile/${theme.user.login}`}>
              <ColorNicknameUser
                user={{ login: theme.user.login, role: theme.user.role }}
                fontSize={14}
                fontWeight={500}
              />
            </Link>
            <br />
            Раздел:{" "}
            <Link
              href={`/subCategories/${decodeURIComponent(
                theme.SubCategories.title
              )}?subCategory=${theme.SubCategories.id}`}
            >
              {theme.SubCategories.title}
            </Link>
          </span>
        </div>
      </div>
      <EditorContent
        editor={viewer}
        className="text-sm wrap-break-word max-h-25 line-clamp-5 text-neutral-800 dark:text-neutral-200 lg:pl-12.5"
      />
      <p className="text-sm text-neutral-600 dark:text-neutral-300 font-medium flex flex-row items-center gap-5 lg:pl-12.5">
        <span className="flex flex-row items-center gap-1.25">
          <ClockIcon />
          {Intl.DateTimeFormat("ru-RU", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })
            .format(new Date(theme.createdAt))
            .replace("г.", "")}
        </span>
        <span className="flex flex-row items-center gap-1.25">
          <MessageCircleIcon />
          {theme._count.MessagesPosts}{" "}
          {useDeclinationWord(theme._count.MessagesPosts, [
            "ответ",
            "ответа",
            "ответов",
          ])}
        </span>
      </p>
    </div>
  );
}
