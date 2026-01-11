import { additionalInformation } from "@/data/additionallyInformation";
import AdditionallyInformationCard from "@/components/shared/categories/AdditionallyInformationCard";
import { prisma } from "@/lib/prisma";
import InformationStats from "./InformationStats";
import InformationStatuses from "./InformationStatuses";
import InformationTop from "./InformationTop";
import InformationThemes from "./InformationThemes";
export const revalidate = 60;
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
  const [themesCount, messageCount, lastThemes, lastStatuses, topUsers] =
    await prisma.$transaction([
      prisma.posts.count(),
      prisma.messagesPosts.count(),
      prisma.posts.findMany({
        where: {
          AND: [
            { SubCategories: { visible: true } },
            { SubCategories: { Categories: { visible: "All" } } },
          ],
        },
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          SubCategories: { select: { id: true } },
          _count: {
            select: {
              MessagesPosts: true,
            },
          },
          MessagesPosts: {
            select: {
              Users: { select: { login: true, avatar: true, role: true } },
            },
            take: 1,
            orderBy: { createdAt: "asc" },
          },
          createdAt: true,
        },
      }),
      prisma.statuses.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          createdAt: true,
          id: true,
          user: { select: { role: true, avatar: true, login: true } },
          text: true,
        },
      }),
      prisma.users.findMany({
        take: 5,
        orderBy: { reputation: "desc" },
        select: {
          login: true,
          id: true,
          avatar: true,
          reputation: true,
          role: true,
        },
      }),
    ]);
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
