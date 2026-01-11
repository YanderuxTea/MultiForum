import RankIconChecker from "./RankIconChecker";
import RankTitleChecker from "./RankTitleChecker";
import ReputationChecker from "./ReputationChecker";

export default function AchievementsBlock({
  login,
  countMessage,
  reputation,
}: {
  login: string;
  countMessage: number;
  reputation: number;
}) {
  return (
    <div className="border rounded-md border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#212121] flex flex-col divide-y divide-neutral-300 dark:divide-neutral-700">
      <p className="text-lg p-2.5 font-bold text-neutral-700 dark:text-neutral-200">
        Достижения {login}
      </p>
      <div className="p-2.5 flex flex-row  justify-between items-center w-full text-center lg:w-[70%] mx-auto">
        <div className="flex flex-col items-center justify-center gap-2.5">
          <RankIconChecker countMessage={countMessage} />
          <RankTitleChecker countMessage={countMessage} level={true} />
        </div>
        <div className="flex flex-col items-center justify-center gap-2.5">
          <ReputationChecker reputation={reputation} />
          <p className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
            Репутация
          </p>
        </div>
      </div>
    </div>
  );
}
