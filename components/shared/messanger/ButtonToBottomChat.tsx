import { RefObject } from "react";
import Arrow from "@/components/shared/icons/Arrow.tsx";
import { motion, MotionValue } from "framer-motion";

export default function ButtonToBottomChat({
  refView,
  y,
  maxDragTop,
}: {
  y: MotionValue;
  maxDragTop: number;
  refView: RefObject<HTMLDivElement | null>;
}) {
  return (
    <motion.button
      layout={"position"}
      initial={{ y: "100%" }}
      animate={{ y: "0%" }}
      exit={{ y: "200%" }}
      onMouseDown={(e) => {
        e.preventDefault();
      }}
      onTouchStart={(e) => {
        e.preventDefault();
      }}
      onClick={() => {
        y.stop();
        y.set(-maxDragTop);
      }}
      transition={{ duration: 0.3, type: "tween" }}
      className={`border border-neutral-300 dark:border-neutral-700 absolute right-3.75 rounded-full cursor-pointer z-12 bg-neutral-200 dark:bg-neutral-800 transition-colors duration-300 ease-out p-0.75 hover:bg-neutral-300 dark:hover:bg-neutral-700`}
      style={{
        top: `${refView.current && refView.current.clientHeight + 27}px`,
      }}
    >
      <Arrow />
    </motion.button>
  );
}
