import { ranks } from "@/data/ranksData";
import Image from "next/image";

export default function RankIconChecker({
  countMessage,
}: {
  countMessage: number;
}) {
  const rank = ranks.find((val) => countMessage >= val.countMess);
  return <Image alt="rank" src={rank!.icon} draggable={false} />;
}
