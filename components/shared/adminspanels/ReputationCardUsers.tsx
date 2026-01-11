import { IUsersReputation } from "@/components/ui/adminspanels/ReputationManagement";
import AvatarUser from "../users/AvatarUser";
import { motion } from "framer-motion";
import React from "react";
import ColorNicknameUser from "../users/ColorNicknameUser";
import ReputationChecker from "@/components/ui/profiles/ReputationChecker";
export default function ReputationCardUsers({
  props,
  setIsOpenMenu,
  setUserSelected,
}: {
  setUserSelected: React.Dispatch<
    React.SetStateAction<IUsersReputation | null>
  >;
  setIsOpenMenu: React.Dispatch<React.SetStateAction<boolean>>;
  props: IUsersReputation;
}) {
  return (
    <motion.div
      onClick={() => {
        setIsOpenMenu(true);
        setUserSelected(props);
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      layout
      transition={{ duration: 0.4 }}
      className="border flex flex-row border-neutral-300 dark:border-neutral-700 rounded-md p-2.5 cursor-pointer transition-colors duration-300 ease-out hover:bg-neutral-200 dark:hover:bg-neutral-700 items-center w-full justify-between"
    >
      <div className="flex flex-row items-center gap-2.5">
        <AvatarUser
          props={{
            role: props.role,
            avatar: props.avatar || undefined,
            width: 48,
            height: 48,
          }}
        />
        <ColorNicknameUser
          user={{ login: props.login, role: props.role }}
          fontSize={16}
          fontWeight={600}
        />
      </div>
      <ReputationChecker reputation={props.reputation} />
    </motion.div>
  );
}
