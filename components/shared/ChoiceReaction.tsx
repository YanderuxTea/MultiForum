"use client";

import React, { useEffect, useState } from "react";
import ArrowReaction from "./icons/ArrowReaction";
import HeartReaction from "./icons/HeartReaction";
import { motion } from "framer-motion";
import { IMessage, IReaction, ReactionType } from "@/context/CategoriesContext";
import useNotify from "@/hooks/useNotify";

export default function ChoiceReaction({
  choice,
  messageId,
  setMessages,
  toUserId,
}: {
  toUserId: string;
  setMessages: React.Dispatch<React.SetStateAction<IMessage[] | undefined>>;
  messageId: string;

  choice: IReaction | null;
}) {
  const [visual, setVisual] = useState<"initial" | "hover" | "open">("initial");
  const { setIsNotify, setMessage } = useNotify();
  const [pending, setPending] = React.useTransition();
  const variants = {
    initial: {
      width: 44,
    },
    hover: {
      width: 120,
    },
    open: {
      width: 120,
    },
  };
  const orderMap = {
    null: { up: 1, like: 2, down: 3 },
    up: { up: 1, like: 2, down: 3 },
    like: { like: 1, up: 2, down: 3 },
    down: { down: 1, like: 2, up: 3 },
  };
  const [complete, setComplete] = React.useState<boolean>(false);
  const buttons = [
    {
      id: "up" as const,
      component: <ArrowReaction />,
      color: "bg-[#289E67] dark:bg-[#008849]",
      hover: "hover:bg-[#289E67] dark:hover:bg-[#008849]",
    },
    {
      id: "like" as const,
      component: <HeartReaction />,
      color: "bg-[#F76700] dark:bg-[#FF6524]",
      hover: "hover:bg-[#F76700] dark:hover:bg-[#FF6524]",
    },
    {
      id: "down" as const,
      component: <ArrowReaction />,
      color: "bg-[#EB4848] dark:bg-[#E02E2E]",
      hover: "hover:bg-[#EB4848] dark:hover:bg-[#E02E2E]",
    },
  ];
  useEffect(() => {
    function handleClose() {
      if (complete) {
        setVisual("initial");
      }
    }
    window.addEventListener("scroll", handleClose);
    return () => {
      window.removeEventListener("scroll", handleClose);
    };
  }, [complete]);
  async function setReaction(reaction: ReactionType) {
    if (choice?.reactionType === reaction) {
      setPending(async () => {
        const req = await fetch("/api/setReaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            reactionType: "delete",
            reactionId: choice.id,
          }),
        });
        const res: { ok: boolean; error?: string } = await req.json();
        if (res.ok) {
          setMessages((prev) =>
            (prev || []).map((mess) => {
              if (mess.id !== messageId) {
                return mess;
              } else {
                return {
                  ...mess,
                  reactions: mess.reactions.filter(
                    (reaction) => reaction.id !== choice.id,
                  ),
                };
              }
            }),
          );
          if (visual === "open") {
            setVisual("initial");
          }
        } else {
          setMessage(`Ошибка: ${res.error}`);
          setIsNotify(true);
        }
      });
    } else if (!choice) {
      setPending(async () => {
        const req = await fetch("/api/setReaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messageId: messageId,
            reactionType: reaction,
            toUserId: toUserId,
          }),
        });
        const res: { ok: boolean; reaction: IReaction; error?: string } =
          await req.json();
        if (res.ok) {
          setMessages((prev) =>
            (prev || []).map((mess) => {
              if (mess.id === messageId) {
                return {
                  ...mess,
                  reactions: [...mess.reactions, res.reaction],
                };
              }
              return mess;
            }),
          );
          if (visual === "open") {
            setVisual("initial");
          }
        } else {
          setMessage(`Ошибка: ${res.error}`);
          setIsNotify(true);
        }
      });
    } else {
      setPending(async () => {
        const req = await fetch("/api/setReaction", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messageId: messageId,
            reactionType: reaction,
            toUserId: toUserId,
            reactionId: choice.id,
          }),
        });
        const res: { ok: boolean; reaction: IReaction; error?: string } =
          await req.json();
        if (res.ok) {
          setMessages((prev) =>
            (prev || []).map((mess) => {
              if (mess.id === messageId) {
                const newReaction = mess.reactions.filter(
                  (react) => react.id !== choice.id,
                );
                return { ...mess, reactions: [...newReaction, res.reaction] };
              }
              return mess;
            }),
          );
          if (visual === "open") {
            setVisual("initial");
          }
        } else {
          setMessage(`Ошибка: ${res.error}`);
          setIsNotify(true);
        }
      });
    }
  }
  return (
    <motion.div
      variants={variants}
      animate={visual}
      onHoverStart={() => {
        if (!complete) {
          setVisual("hover");
        }
      }}
      onHoverEnd={() => {
        setVisual("initial");
      }}
      onTap={() => {
        if (visual !== "open") {
          setVisual("open");
        }
      }}
      transition={{ type: "spring", bounce: 0.1 }}
      onAnimationComplete={(variant) => {
        if (variant === "open" || variant === "hover") {
          setComplete(true);
        }
        if (variant === "initial") {
          setComplete(false);
        }
      }}
      className="border w-11 flex flex-row p-1.25 relative overflow-clip rounded-full border-neutral-300 dark:border-neutral-700 gap-1.25"
    >
      {buttons.map((button) => {
        return (
          <motion.button
            key={button.id}
            layout
            transition={{ type: "spring" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 1.1 }}
            onClick={
              complete
                ? pending
                  ? () => setReaction(button.id)
                  : undefined
                : undefined
            }
            style={{
              order: orderMap[choice?.reactionType ?? "null"][button.id],
            }}
            className={`select-none ${
              choice?.reactionType
                ? choice?.reactionType === button.id
                  ? button.color
                  : `bg-neutral-300 dark:bg-neutral-700 ${button.hover}`
                : `bg-neutral-300 dark:bg-neutral-700 ${button.hover}`
            } w-8 h-8 aspect-square transition-colors duration-300 ease-out rounded-full shrink-0  flex items-center justify-center cursor-pointer ${
              button.id === "up" && "rotate-180"
            }`}
          >
            {button.component}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
