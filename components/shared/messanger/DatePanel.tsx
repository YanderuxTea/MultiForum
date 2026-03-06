import { motion } from "framer-motion";

export default function DatePanel({
  date,
  timeFormatterDate,
}: {
  date: Date;
  timeFormatterDate: (date: Date) => string;
}) {
  const convertedDate = timeFormatterDate(date);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, y: 5 }}
      exit={{ opacity: 0, y: "-100%" }}
      className={
        "absolute z-10 inset-x-0 flex justify-center items-center select-none"
      }
    >
      <div
        className={
          "bg-neutral-500/50 dark:bg-neutral-700/40 py-0.5 px-2.5 rounded-full text-white font-medium text-sm"
        }
      >
        {convertedDate}
      </div>
    </motion.div>
  );
}
