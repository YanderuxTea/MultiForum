import {
  motion,
  MotionValue,
  useDragControls,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { MouseEvent, RefObject, useEffect, useRef, useState } from "react";

export default function CustomScrollbarDesktop({
  y,
  refView,
  yOffset,
  maxDragTop,
  containerMessagesHeight,
  isScrollingStop,
}: {
  isScrollingStop: boolean;
  containerMessagesHeight: number;
  yOffset: RefObject<number>;
  maxDragTop: number;
  y: MotionValue;
  refView: RefObject<HTMLDivElement | null>;
}) {
  const containerScrollbarRef = useRef<HTMLDivElement | null>(null);
  const step = useRef<number>(0);
  function check(e: MouseEvent<HTMLDivElement>) {
    if (containerScrollbarRef.current !== e.target) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const yClick = e.clientY - rect.top;
    if (refView.current) {
      const newOffset = Math.min(
        0,
        Math.max(-maxDragTop, -(yClick - 14) * step.current),
      );
      y.set(newOffset);
    }
  }
  useEffect(() => {
    if (!refView.current) return;
    step.current = maxDragTop / (refView.current.clientHeight - 32);
  }, [refView, maxDragTop, containerMessagesHeight]);
  const scrollYProgress = useTransform(
    y,
    [0, maxDragTop > 0 ? -maxDragTop : -1],
    [0, refView.current && refView.current.clientHeight - 32],
  );
  const scrollYProgressActual = useRef<number>(0);
  const scrollYProgressPrev = useRef<number>(0);
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest) {
      scrollYProgressPrev.current = scrollYProgressActual.current;
      scrollYProgressActual.current = latest;
    }
  });
  const controls = useDragControls();
  const motionRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (isScrollingStop && motionRef.current) {
      controls.cancel();
      setTargetThumb(true);
    }
  }, [controls, isScrollingStop]);
  const [targetThumb, setTargetThumb] = useState<boolean>(false);
  return (
    <div
      className={`absolute w-2.25 flex z-12 items-center justify-center right-0 ${refView.current && refView.current.clientHeight < containerMessagesHeight ? "opacity-100" : "opacity-0"}`}
      style={{ height: `${refView.current && refView.current.clientHeight}px` }}
    >
      <div
        ref={containerScrollbarRef}
        onClick={(e) => check(e)}
        className=" bg-neutral-200 dark:bg-[#272727] rounded-b-full rounded-t-full w-1.5 flex right-0 justify-center z-20"
        style={{
          height: `${refView.current && refView.current.clientHeight - 4}px`,
        }}
      >
        <motion.div
          dragControls={controls}
          ref={motionRef}
          style={{
            y: scrollYProgress,
          }}
          dragConstraints={containerScrollbarRef}
          dragMomentum={false}
          drag="y"
          dragElastic={0}
          onDrag={(e, info) => {
            if (info.delta.y === 0 || isScrollingStop) return;
            const diffScroll =
              scrollYProgressActual.current - scrollYProgressPrev.current;
            const newStep = yOffset.current - diffScroll * step.current;
            const newOffset = Math.min(0, Math.max(-maxDragTop, newStep));
            y.set(newOffset);
          }}
          className={
            "bg-neutral-400 dark:bg-[#616161] w-full h-7 rounded-b-full rounded-t-full transition-colors" +
            ` duration-300 ease-out hover:bg-neutral-500 dark:hover:bg-[#9c9c9c] ${
              !targetThumb &&
              "active:bg-neutral-500" + "  dark:active:bg-[#9c9c9c]"
            }`
          }
        ></motion.div>
      </div>
    </div>
  );
}
