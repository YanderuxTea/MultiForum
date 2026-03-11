"use client";
import Logo from "@/components/shared/Logo";
import Menu from "@/components/shared/icons/Menu";
import useCurrentWidth from "@/hooks/useCurrentWidth";
import useHeader from "@/hooks/useHeader";
import ButtonLogin from "@/components/shared/buttons/ButtonLogin";
import useDataUser from "@/hooks/useDataUser";
import Arrow from "@/components/shared/icons/Arrow";
import React, { useEffect, useRef, useState } from "react";
import ButtonLogout from "@/components/shared/buttons/ButtonLogout";
import { AnimatePresence, motion } from "framer-motion";
import ProfileButton from "@/components/shared/buttons/ProfileButton";
import Link from "next/link";
import ButtonSettings from "@/components/shared/buttons/ButtonSettings";
import ButtonAdmins from "@/components/shared/buttons/ButtonAdmins";
import useCheckingStaff from "@/hooks/useCheckingStaff";
import MessangerButton from "@/components/shared/buttons/MessangerButton";
import NotificationsButton from "@/components/shared/buttons/NotificationsButton.tsx";
import NotifyCenterDesktop from "@/components/shared/notifys/NotifyCenterDesktop.tsx";
import NotifyCenterMobile from "@/components/shared/notifys/NotifyCenterMobile.tsx";

export default function Header({ countNotify }: { countNotify: number }) {
  const width = useCurrentWidth();
  const { setIsOpenMenu, isOpenMenu } = useHeader();
  const [openMenuAuth, setOpenMenuAuth] = useState(false);
  const [isOpenNotifyCenter, setIsOpenNotifyCenter] = useState<boolean>(false);
  const userData = useDataUser();
  const menuRef = useRef<HTMLDivElement>(null);
  const containerDesktopNotifyCenter = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function toggleMenu(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuAuth(false);
      }
    }
    function closeNotifyCenter(e: MouseEvent) {
      if (!containerDesktopNotifyCenter.current?.contains(e.target as Node)) {
        setIsOpenNotifyCenter(false);
      }
    }

    window.addEventListener("mousemove", toggleMenu);
    if (width >= 1024) {
      window.addEventListener("click", closeNotifyCenter);
    } else {
      window.removeEventListener("click", closeNotifyCenter);
    }
    return () => {
      window.removeEventListener("click", closeNotifyCenter);
      window.removeEventListener("mousemove", toggleMenu);
    };
  }, [width]);
  const { checkStaff } = useCheckingStaff({
    role: userData ? userData.role : "User",
  });
  return (
    <>
      <header
        className={`${
          isOpenMenu
            ? "bg-white dark:bg-[#212121]"
            : "bg-white/50 dark:bg-[#212121]/80"
        } w-full flex items-center px-2.5 fixed z-30 justify-center border-b border-neutral-300 dark:border-neutral-700 backdrop-blur-sm transition-colors duration-300 ease-out`}
      >
        <div className="max-w-300 w-full flex flex-row justify-between">
          <Logo />
          {width < 1024 && (
            <div className={"flex flex-row gap-2.5 items-center"}>
              {userData && (
                <NotificationsButton
                  isOpenNotifyCenter={isOpenNotifyCenter}
                  countNotify={countNotify}
                  setIsOpenNotifyCenter={setIsOpenNotifyCenter}
                />
              )}

              <button onClick={() => setIsOpenMenu((prevState) => !prevState)}>
                <Menu />
              </button>
            </div>
          )}
          {width >= 1024 && userData === null ? (
            <div className="flex items-center">
              <ButtonLogin />
            </div>
          ) : (
            width >= 1024 && (
              <div
                ref={menuRef}
                className="flex flex-row justify-between items-center gap-2.5 relative"
              >
                <div
                  className={
                    "relative flex items-center mr-1.25 p-1.25 rounded-full transition-colors duration-300 ease-out" +
                    `  ${
                      isOpenNotifyCenter
                        ? "bg-neutral-300/75 dark:bg-neutral-700/75"
                        : "hover:bg-neutral-200/75 dark:hover:bg-neutral-800/90"
                    }`
                  }
                  ref={containerDesktopNotifyCenter}
                >
                  <NotificationsButton
                    isOpenNotifyCenter={isOpenNotifyCenter}
                    countNotify={countNotify}
                    setOpenMenuAuth={setOpenMenuAuth}
                    setIsOpenNotifyCenter={setIsOpenNotifyCenter}
                  />
                  <AnimatePresence>
                    {isOpenNotifyCenter && <NotifyCenterDesktop />}
                  </AnimatePresence>
                </div>

                <Link
                  onMouseMove={() => {
                    setOpenMenuAuth(true);
                    setIsOpenNotifyCenter(false);
                  }}
                  href={`/profile/${userData?.login}`}
                  className="select-none font-medium text-neutral-800 dark:text-neutral-200 text-lg"
                >
                  {userData?.login}
                </Link>
                <span
                  onMouseMove={() => setOpenMenuAuth(true)}
                  className={`transition-transform duration-300 ease-out ${
                    openMenuAuth ? "rotate-180" : "rotate-0"
                  }`}
                >
                  <Arrow />
                </span>
                <AnimatePresence>
                  {openMenuAuth && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className={`flex-col gap-2.5 flex rounded-b-[14px] border-x border-b border-gray-700/25 dark:border-white/10 absolute right-0 top-14 -z-1 bg-white dark:bg-[#212121] p-2.5 ${
                        checkStaff ? "w-60" : "w-42.5"
                      }`}
                    >
                      <ProfileButton />
                      <ButtonSettings />
                      {checkStaff && <ButtonAdmins />}
                      {userData?.verifyAdm === "Yes" && <MessangerButton />}
                      <hr className="text-neutral-300 dark:text-neutral-700" />
                      <ButtonLogout />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          )}
        </div>
      </header>
      <AnimatePresence>
        {width < 1024 && isOpenNotifyCenter && userData && (
          <NotifyCenterMobile setIsOpenNotifyCenter={setIsOpenNotifyCenter} />
        )}
      </AnimatePresence>
    </>
  );
}
