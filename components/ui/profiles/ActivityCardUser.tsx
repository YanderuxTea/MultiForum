import { EditorContent, generateText, useEditor } from "@tiptap/react";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import Youtube from "@tiptap/extension-youtube";
import Image from "@tiptap/extension-image";
import { IProfileMessage } from "@/app/api/getMessagesProfile/route";
import Link from "next/link";
import ColorNicknameUser from "@/components/shared/users/ColorNicknameUser";
import useDeclinationWord from "@/hooks/useDeclinationWord";
import ClockIcon from "@/components/shared/icons/ClockIcon";
import MessageCircleIcon from "@/components/shared/icons/MessageCircleIcon";
import AvatarUser from "@/components/shared/users/AvatarUser";
import SmallLockIcon from "@/components/shared/icons/SmallLockIcon";
export default function ActivityCardUser({
  props,
}: {
  props: IProfileMessage;
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
  return (
    <div className="p-2.5 flex flex-col gap-5 overflow-clip w-full">
      <div className="flex flex-row items-center gap-2.5">
        <div className="hidden lg:block">
          <AvatarUser
            props={{
              role: props.Users.role,
              avatar: props.Users.avatar ?? undefined,
              width: 40,
              height: 40,
            }}
          />
        </div>
        <div className="flex flex-col w-[90%]">
          <span className="flex flex-row items-center gap-1.25 truncate w-[70%]">
            {props.Posts.locked && <SmallLockIcon />}
            <Link
              href={`/theme/${props.Posts.title}?themeId=${props.Posts.id}&subCategoryId=${props.Posts.SubCategories.id}`}
              className="transition-colors duration-300 ease-out hover:text-blue-500 dark:hover:text-blue-600 truncate block font-medium text-neutral-800 dark:text-neutral-200 text-xl max-w-max"
            >
              {props.Posts.title}
            </Link>
          </span>
          <span
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 
          w-[80%]"
          >
            <ColorNicknameUser
              user={{ role: props.Users.role, login: props.Users.login }}
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
          {props.Posts._count.MessagesPosts}{" "}
          {useDeclinationWord(props.Posts._count.MessagesPosts, [
            "ответ",
            "ответа",
            "ответов",
          ])}
        </span>
      </p>
    </div>
  );
}
