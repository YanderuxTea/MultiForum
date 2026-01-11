export default function ReputationChecker({
  reputation,
  small,
}: {
  small?: boolean;
  reputation: number;
}) {
  const color =
    reputation === 0
      ? "bg-neutral-400 dark:bg-neutral-600"
      : reputation > 0
      ? "bg-emerald-600"
      : "bg-red-700";
  function formatReputation(rep: number) {
    const sign = rep < 0 ? "-" : "";
    const absRep = Math.abs(rep);
    if (absRep >= 1000) {
      return sign + (absRep / 1000).toFixed(1) + "k";
    }
    return sign + absRep.toString();
  }
  const convertedRep = formatReputation(reputation);
  return (
    <p
      className={` ${color} select-none text-white aspect-auto items-center justify-center flex rounded-full font-medium  ${
        small ? "text-sm px-1.25 w-12" : `text-lg px-2.5  h-8.5  `
      }`}
    >
      {convertedRep}
    </p>
  );
}
