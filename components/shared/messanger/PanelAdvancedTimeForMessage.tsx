import { motion } from "framer-motion";
import usePanelAdvancedTime from "@/hooks/usePanelAdvancedTime.ts";
import useContextMenu from "@/hooks/useContextMenu.ts";

export default function PanelAdvancedTimeForMessage() {
  const { position, convertedDate, isAuthor } = usePanelAdvancedTime();
  const { messengerPageRefContainer } = useContextMenu();
  const rect = messengerPageRefContainer.current?.getBoundingClientRect();
  const top = rect?.top || 0;
  const left = rect?.left || 0;
  const additionallyOffset = isAuthor ? -75 : 75;
  return (
    <motion.div
      style={{
        x: position.x - left + additionallyOffset,
        y: position.y - top + 20,
      }}
      className={`absolute z-101 text-sm bg-neutral-200 border border-neutral-300 text-neutral-800 dark:bg-neutral-900 dark:border-none dark:text-neutral-200 p-1.25 px-2 rounded-lg origin-center -translate-x-1/2`}
    >
      {convertedDate}
    </motion.div>
  );
}
