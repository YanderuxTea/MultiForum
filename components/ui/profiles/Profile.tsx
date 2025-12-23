"use client";
import { JSX, useEffect, useRef, useState } from "react";
import nullAvatar from "@/public/svg/user.svg";
import Image from "next/image";
import useDataUser from "@/hooks/useDataUser";
import Camera from "@/components/shared/icons/Camera";
import useChoosePhoto from "@/hooks/useChoosePhoto";
import ChoosePhotoForm from "@/components/ui/profiles/ChoosePhotoForm";
import { AnimatePresence } from "framer-motion";
import MenuWindow from "@/components/ui/menus/MenuWindow";
import CheckNameplateUser from "@/components/shared/users/CheckNameplateUser";
import ColorNicknameUser from "@/components/shared/users/ColorNicknameUser";
import CheckBanned from "@/components/shared/users/CheckBanned";
import OpenMenuAdminsPanelProvider from "@/components/providers/OpenMenuAdminsPanelProvider";
import { IProfileProps } from "@/app/api/getDataProfile/route";
import BlockInformationUser from "@/components/ui/profiles/BlockInformationUser";
import BlockActivityUser from "./BlockActivityUser";
export default function Profile({
  props,
}: {
  props: IProfileProps;
}): JSX.Element {
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedDate = formatter.format(new Date(props.createdAt));
  const [avatar, setAvatar] = useState<string>(
    props.avatar ? props.avatar : nullAvatar
  );
  const isGif = useRef<boolean>(
    typeof props.avatar === "string" &&
      props.avatar.toLowerCase().endsWith(".gif")
  );
  const dataUser = useDataUser();
  const choosePhoto = useChoosePhoto();
  const activeBan =
    props.bans.length > 0
      ? new Date(props.bans[0].date).getTime() +
          props.bans[0].time * 60 * 1000 >
          Date.now() || props.bans[0].time === 0
      : false;
  useEffect(() => {
    isGif.current =
      typeof props.avatar === "string" &&
      props.avatar.toLowerCase().endsWith(".gif");
  }, [avatar]);
  return (
    <div className="min-h-screen flex flex-col gap-2.5 lg:flex-row lg:w-full max-w-300 mx-auto">
      <div className="flex flex-col gap-2.5 lg:w-1/4">
        <AnimatePresence>
          <OpenMenuAdminsPanelProvider>
            <AnimatePresence>
              {choosePhoto.isChoosePhoto && (
                <MenuWindow
                  props={{
                    setIsOpenMenu: choosePhoto.setIsChoosePhoto,
                    isOpenMenu: choosePhoto.isChoosePhoto,
                    setIsHelp: choosePhoto.setIsHelp,
                    content: (
                      <ChoosePhotoForm avatar={avatar} setAvatar={setAvatar} />
                    ),
                  }}
                />
              )}
            </AnimatePresence>
          </OpenMenuAdminsPanelProvider>
        </AnimatePresence>
        <div className="w-full mx-auto flex items-center justify-center flex-col gap-2.5 bg-white dark:bg-[#212121] p-2.5 rounded-md border border-neutral-300 dark:border-neutral-700">
          <ColorNicknameUser
            user={{ role: props.role, login: props.login }}
            fontSize={20}
            fontWeight={700}
          />
          {dataUser && dataUser.login === props.login ? (
            <div
              className={`relative rounded-full outline-2 overflow-clip bg-white ${
                props.role === "Admin"
                  ? "outline-red-600"
                  : props.role === "Moderator"
                  ? "outline-blue-700"
                  : "outline-gray-500"
              }`}
            >
              <Image
                src={avatar}
                alt="Profile avatar"
                draggable={false}
                width={128}
                height={128}
                onError={() => setAvatar(nullAvatar)}
                className={`w-32 h-32 aspect-square`}
                priority
                unoptimized={isGif.current}
              />
              <div
                className="absolute inset-0 p-1.25 flex items-center justify-center bg-black/25 dark:bg-black/50 transition-opacity duration-300 ease-out opacity-0 hover:opacity-100 select-none cursor-pointer"
                onClick={() => choosePhoto.setIsChoosePhoto(true)}
              >
                <Camera />
              </div>
            </div>
          ) : (
            <Image
              src={avatar}
              alt="Profile avatar"
              draggable={false}
              width={128}
              height={128}
              onError={() => setAvatar(nullAvatar)}
              className={`bg-white outline-2 rounded-full w-32 h-32 aspect-square ${
                props.role === "Admin"
                  ? "outline-red-600"
                  : props.role === "Moderator"
                  ? "outline-blue-700"
                  : "outline-gray-500"
              }`}
              priority
              unoptimized={isGif.current}
            />
          )}
          <p className="text-balance text-center font-medium text-neutral-600 dark:text-neutral-300 max-w-57.5">
            Дата регистрации: {formattedDate}
          </p>
          {activeBan && <CheckBanned />}
          <CheckNameplateUser role={props.role} />
        </div>
        <BlockInformationUser
          countBans={props._count.bans}
          countMessage={props._count.MessagesPosts}
          countWarns={props._count.warns}
        />
      </div>
      <BlockActivityUser countMessage={props._count.MessagesPosts} />
    </div>
  );
}
