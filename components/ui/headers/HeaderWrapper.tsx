"use client";
import Header from "@/components/ui/headers/Header";
import { AnimatePresence } from "framer-motion";
import MenuMobile from "@/components/ui/menus/MenuMobile";
import useHeader from "@/hooks/useHeader";
import useCurrentWidth from "@/hooks/useCurrentWidth";

export default function HeaderWrapper() {
  const { isOpenMenu } = useHeader();
  const width = useCurrentWidth();
  return (
    <>
      <Header />
      <AnimatePresence>
        {isOpenMenu && width <= 1024 && <MenuMobile />}
      </AnimatePresence>
    </>
  );
}
