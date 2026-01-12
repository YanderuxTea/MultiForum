import { prisma } from "./prisma";

export async function getAdditionalInfoData() {
  const [themesCount, messageCount, lastThemes, lastStatuses, topUsers] =
    await prisma.$transaction(async (trx) => [
      await trx.posts.count(),
      await trx.messagesPosts.count(),
      await trx.posts.findMany({
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
      await trx.statuses.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        select: {
          createdAt: true,
          id: true,
          user: { select: { role: true, avatar: true, login: true } },
          text: true,
        },
      }),
      await trx.users.findMany({
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
  return { themesCount, messageCount, lastThemes, lastStatuses, topUsers };
}
