"use server";
import { prisma } from "@/lib/prisma.ts";
import { revalidateTag, unstable_cache } from "next/cache";
import { INotification } from "@/components/providers/NotifyProvider.tsx";
import { cookies } from "next/headers";
import { validateJWT } from "@/lib/jwt.ts";

export async function refreshNotifications(userLogin: string) {
  revalidateTag(`notificationsCount-${userLogin}`, "max");
  revalidateTag(`notificationsNotify-${userLogin}`, "max");
}
export async function getNotificationsCount(userLogin: string | undefined) {
  const check = await unstable_cache(
    async () => {
      const count = await prisma.notifications.count({
        where: { userLoginTo: userLogin, isRead: false },
      });
      return count;
    },
    ["notificationsCount", userLogin || ""],
    { revalidate: 300, tags: [`notificationsCount-${userLogin}`] },
  );
  const count = await check();
  return count;
}
export async function getNotifications(
  userLogin: string | undefined,
  cursor: string,
  prevNotifications: INotification[],
) {
  const pageSize = 30;
  const getNotify = unstable_cache(
    async () => {
      const notifications = await prisma.notifications.findMany({
        where: {
          userLoginTo: userLogin,
          ...(cursor.length > 0 && { id: { lt: cursor } }),
        },
        take: pageSize + 1,
        orderBy: { id: "desc" },
        select: {
          userLoginTo: true,
          id: true,
          createdAt: true,
          type: true,
          metaData: true,
        },
      });
      const hasMore = notifications.length > pageSize;
      if (notifications.length > 0) {
        if (hasMore) {
          notifications.pop();
        }
        const nextCursor = notifications.at(-1)?.id;
        const newNotifications = notifications.map(
          (notification): INotification => ({
            loginRecipient: notification.userLoginTo,
            idNotify: notification.id,
            createdAt: notification.createdAt,
            typeNotify: notification.type,
            metaData: notification.metaData,
          }),
        );
        const fullNotify = [...prevNotifications, ...newNotifications];
        return { fullNotify, nextCursor, hasMore };
      }
      return { fullNotify: [], nextCursor: "", hasMore: false };
    },
    ["notificationsNotify", userLogin || ""],
    { revalidate: 300, tags: [`notificationsNotify-${userLogin}`] },
  );
  const response = getNotify();
  return response;
}
export async function markAllNotifications(countNotify: number) {
  if (countNotify === 0) {
    return;
  }
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (!token) {
    return;
  }
  const validToken = validateJWT(token.value);
  if (!validToken || typeof validToken === "string") {
    return;
  }
  await refreshNotifications(validToken.login);
  await prisma.notifications.updateMany({
    where: { userLoginTo: validToken.login, isRead: false },
    data: { isRead: true },
  });
  return { ok: true };
}
