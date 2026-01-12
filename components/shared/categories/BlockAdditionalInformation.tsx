import { additionalInformation } from "@/data/additionallyInformation";
import AdditionallyInformationCard from "@/components/shared/categories/AdditionallyInformationCard";
import { prisma } from "@/lib/prisma";
import InformationStats from "./InformationStats";
import InformationStatuses from "./InformationStatuses";
import InformationTop from "./InformationTop";
import InformationThemes from "./InformationThemes";
import { getAdditionalInfoData } from "@/lib/getAdditionalInfoData";
export interface ILastThemes {
  id: string;
  title: string;
  createdAt: Date;
  SubCategories: {
    id: string;
  };
  _count: {
    MessagesPosts: number;
  };
  MessagesPosts: {
    Users: {
      login: string;
      role: string;
      avatar: string | null;
    };
  }[];
}
export interface ILastStatuses {
  id: string;
  createdAt: Date;
  user: {
    login: string;
    role: string;
    avatar: string | null;
  };
  text: string;
}
export interface IAdditionalDataCard {
  themesCount: number;
  messageCount: number;
  lastThemes: ILastThemes[];
  lastStatuses: ILastStatuses[];
}
export default async function BlockAdditionalInformation() {
  const res = await getAdditionalInfoData();
  const { themesCount, messageCount, lastThemes, lastStatuses, topUsers } = res;
  const data = {
    themesCount: themesCount,
    messageCount: messageCount,
    lastThemes: lastThemes,
    lastStatuses: lastStatuses,
    topUsers: topUsers,
  };
  return (
    <div className="w-full lg:w-2/7 flex flex-col gap-5">
      {additionalInformation.map((info) => {
        const content =
          info.type === "stats" ? (
            <InformationStats
              themesCount={data.themesCount}
              messageCount={data.messageCount}
            />
          ) : info.type === "statuses" ? (
            <InformationStatuses props={data.lastStatuses} />
          ) : info.type === "top" ? (
            <InformationTop props={data.topUsers} />
          ) : info.type === "themes" ? (
            <InformationThemes props={data.lastThemes} />
          ) : (
            <p className="py-2.5">В разработке</p>
          );
        return (
          <AdditionallyInformationCard
            key={info.type}
            props={info}
            content={content}
          />
        );
      })}
    </div>
  );
}
