"use client";
import React, { JSX, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ExitIcon from "@/components/shared/icons/ExitIcon";
import useOpenMenuAdminsPanel from "@/hooks/useOpenMenuAdminsPanel";

interface IProps {
  setIsOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  content: JSX.Element;
  isOpenMenu: boolean;
  setIsHelp?: React.Dispatch<React.SetStateAction<boolean>>;
  pending?: boolean;
}
export default function MenuWindow({ props }: { props: IProps }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { setIsOpenList } = useOpenMenuAdminsPanel();
  useEffect(() => {
    function handleClose(e: MouseEvent) {
      if (e.target === containerRef.current) {
        if (!props.pending) {
          props.setIsOpenMenu(false);
          document.body.style.overflow = "unset";
          if (props.setIsHelp) {
            props.setIsHelp(false);
            document.body.style.overflow = "unset";
          } else if (setIsOpenList) {
            setIsOpenList(false);
            document.body.style.overflow = "unset";
          }
        }
      }
    }
    window.addEventListener("click", handleClose);
    return () => {
      window.removeEventListener("click", handleClose);
    };
  }, [props.pending]);
  useEffect(() => {
    if (props.isOpenMenu) {
      document.body.style.overflow = "hidden";
    }
  }, [props.isOpenMenu]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-black/25 backdrop-blur-xs fixed inset-0 z-100 flex items-center justify-center p-2.5"
      ref={containerRef}
    >
      <div className="bg-white dark:bg-[#212121] rounded-md p-5 border border-neutral-300 dark:border-neutral-700 relative w-full max-w-100 max-h-180 overflow-y-auto">
        <button
          disabled={props.pending}
          onClick={() => {
            if (!props.pending) {
              props.setIsOpenMenu(false);
              document.body.style.overflow = "unset";
              if (props.setIsHelp) {
                props.setIsHelp(false);
                document.body.style.overflow = "unset";
              } else if (setIsOpenList) {
                setIsOpenList(false);
                document.body.style.overflow = "unset";
              }
            }
          }}
          className="absolute top-1.25 right-1.25 group cursor-pointer"
        >
          <ExitIcon />
        </button>
        {props.content}
      </div>
    </motion.div>
  );
}
