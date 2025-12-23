import { ISubCategories } from "@/context/CategoriesContext";
import useCheckIconSubCategory from "@/hooks/useCheckIconSubCategory";
import Link from "next/link";
import useDeclinationWord from "@/hooks/useDeclinationWord.ts";
import AvatarUser from "@/components/shared/users/AvatarUser.tsx";
import useTimeAgo from "@/hooks/useTimeAgo.ts";
import ColorNicknameUser from "@/components/shared/users/ColorNicknameUser.tsx";

export default function SubCategoriesCard({
  props,
}: {
  props: ISubCategories;
}) {
  const icon = useCheckIconSubCategory({ props: props });
  const time = useTimeAgo(
    props.posts.length > 0
      ? props.posts[0].MessagesPosts[0].createdAt
      : new Date()
  );
  return (
    <div className="flex flex-row items-center p-2.5 gap-5">
      <div className="bg-orange-500 dark:bg-orange-600 opacity-40 p-1.25 rounded-full">
        {icon}
      </div>
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex flex-col">
          <Link
            href={`/subCategories/${props.title}?subCategory=${props.id}`}
            className="transition-colors duration-300 ease-out max-w-max hover:text-blue-500 dark:hover:text-blue-600 text-lg text-neutral-900 dark:text-neutral-100 font-medium"
          >
            {props.title}
          </Link>
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            {props._count.posts}{" "}
            {useDeclinationWord(props._count.posts, ["тема", "темы", "тем"])}
          </p>
        </div>
        {props.posts.length > 0 && (
          <div className="flex flex-col lg:flex-row items-center w-[30%] gap-1.25 text-center lg:w-[37%] lg:gap-2.5">
            <Link
              href={`/profile/${props.posts[0].MessagesPosts[0].Users.login}`}
            >
              <AvatarUser
                props={{
                  role: props.posts[0].MessagesPosts[0].Users.role,
                  avatar:
                    props.posts[0].MessagesPosts[0].Users.avatar ?? undefined,
                  width: 40,
                  height: 40,
                }}
              />
            </Link>
            <p className="text-[11px] lg:hidden text-neutral-700 dark:text-neutral-300 font-medium">
              {time}
            </p>
            <div className="hidden lg:flex flex-col w-45 text-start">
              <Link
                className="font-medium text-neutral-800 dark:text-neutral-200 truncate hover:text-blue-500 dark:hover:text-blue-600 transition-colors duration-300 ease-out"
                href={`/theme/${decodeURIComponent(
                  props.posts[0].title
                )}?themeId=${props.posts[0].id}&subCategoryId=${
                  props.posts[0].idSubCategories
                }`}
              >
                {props.posts[0].title}
              </Link>
              <span className="text-[13px] gap-0.5 relative flex flex-wrap text-neutral-700 dark:text-neutral-300 font-medium">
                Автор:
                <Link
                  href={`/profile/${props.posts[0].MessagesPosts[0].Users.login}`}
                  className="w-[70%] truncate"
                >
                  <ColorNicknameUser
                    user={{
                      role: props.posts[0].MessagesPosts[0].Users.role,
                      login: props.posts[0].MessagesPosts[0].Users.login,
                    }}
                    fontSize={13}
                    fontWeight={500}
                  />
                </Link>
                {time}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
