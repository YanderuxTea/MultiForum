import { ranks } from "@/data/ranksData";

export default function RankTitleChecker({
  countMessage,
  level,
}: {
  countMessage: number;
  level: boolean;
}) {
  const rank = ranks.find((val) => countMessage >= val.countMess);
  return (
    <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
      {rank?.title} {level && `(${rank?.lvl}/${ranks.length})`}
    </p>
  );
}
