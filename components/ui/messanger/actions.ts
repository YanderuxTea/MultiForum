"use server";

import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { IMessages } from "@/components/shared/messanger/MainChat.tsx";
import crypto from "node:crypto";

export interface IChats {
  id: string;
  idV7: string;
  lastMessageTime: Date;
  MessagesChats: {
    text: string;
  }[];
  Users: {
    login: string;
    role: string;
    avatar: string | null;
  }[];
}
type GetChatsResults =
  | { ok: false }
  | { ok: true; newCursor: string; chats: IChats[]; hasMore: boolean };
export async function getChats(cursor: string): Promise<GetChatsResults> {
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (!token) {
    return { ok: false };
  }
  const validToken = validateJWT(token.value);
  if (!validToken || typeof validToken === "string") {
    return { ok: false };
  }
  const pageSize = 30;
  const chats = await prisma.users.findUnique({
    where: { id: validToken.id },
    select: {
      Chats: {
        ...(cursor.length > 0 && { where: { idV7: { lt: cursor } } }),
        select: {
          id: true,
          MessagesChats: {
            select: { text: true, authorId: true },
            take: 1,
            orderBy: { createdAt: "desc" },
          },
          lastMessageTime: true,
          Users: {
            where: { id: { not: validToken.id } },
            select: { avatar: true, login: true, role: true },
          },
          idV7: true,
        },
        take: pageSize + 1,
        orderBy: { idV7: "desc" },
      },
    },
  });
  if (chats && chats.Chats.length > 0) {
    const hasMoreChats = chats.Chats.length > pageSize;
    if (hasMoreChats) {
      chats.Chats.pop();
    }
    const newCursor = chats.Chats.at(-1)?.idV7 ?? "";

    const decryptedChats = {
      ...chats,
      Chats: await Promise.all(
        chats.Chats.map(async (chat) => {
          const decryptedMessage = await decrypt(chat.MessagesChats[0].text);
          return {
            ...chat,
            MessagesChats: [{ text: decryptedMessage }],
          };
        }),
      ),
    };
    return {
      ok: true,
      newCursor,
      chats: decryptedChats.Chats,
      hasMore: hasMoreChats,
    };
  } else {
    return { ok: false };
  }
}
export async function foundUsers(cursor: string, query: string) {
  const pageSize = 20;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (!token) {
    return { ok: false };
  }
  const validToken = validateJWT(token.value);
  if (!validToken || typeof validToken === "string") {
    return { ok: false };
  }
  const users = await prisma.users.findMany({
    where: {
      login: {
        contains: query,
        mode: "insensitive",
        not: validToken.login,
      },
      verificationAdm: "Yes",
    },
    select: {
      id: true,
      login: true,
      role: true,
      avatar: true,
      Chats: {
        where: { Users: { some: { id: validToken.id } } },
        select: { id: true },
        take: 1,
      },
    },
    take: pageSize + 1,
    ...(cursor.length > 0 && { cursor: { login: cursor }, skip: 1 }),
    orderBy: { login: "asc" },
  });
  const hasMore = users.length > pageSize;
  if (hasMore) {
    users.pop();
  }
  const newCursor = users.at(-1)?.login ?? "";
  return {
    ok: true,
    users: users,
    hasMore: hasMore,
    cursor: hasMore ? newCursor : "",
  };
}
export async function getChat(chatId: string | null, login: string | null) {
  if (!chatId || !login) {
    return { ok: false };
  }
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (!token) {
    return { ok: false };
  }
  const validToken = validateJWT(token.value);
  if (!validToken || typeof validToken === "string") {
    return { ok: false };
  }
  const chatData = await prisma.users.findUnique({
    where: { login: login, verificationAdm: "Yes" },
    select: {
      login: true,
      avatar: true,
      isOnline: true,
      role: true,
      Chats: {
        where: {
          OR: [
            { id: chatId },
            { Users: { some: { login: validToken.login } } },
          ],
          Users: { some: { id: validToken.id } },
        },
        select: {
          MessagesChats: {
            select: { id: true, text: true, createdAt: true, authorId: true },
            take: 51,
            orderBy: { id: "desc" },
          },
        },
        take: 1,
      },
    },
  });
  if (!chatData) {
    return { ok: false };
  }
  if (
    (chatId === "recent" && chatData.Chats.length > 0) ||
    (chatId !== "recent" && chatData.Chats.length === 0)
  ) {
    return { ok: false };
  }
  let hasMore = false;
  if (chatData.Chats.length > 0) {
    hasMore = chatData.Chats[0].MessagesChats.length > 50;
    if (hasMore) {
      chatData.Chats[0].MessagesChats.pop();
    }
  }
  const cursor = hasMore
    ? chatData.Chats[0]?.MessagesChats?.at(-1)?.id || ""
    : "";
  let chatDataDecrypted = chatData;
  if (chatData.Chats.length > 0) {
    const messagesChat = chatData.Chats[0].MessagesChats;
    const newMessagesChat: IMessages[] = [];
    messagesChat.map(async (mess) => {
      const decryptedMessage = await decrypt(mess.text);
      newMessagesChat.push({
        ...mess,
        text: decryptedMessage,
      });
    });
    chatDataDecrypted = {
      ...chatData,
      Chats: [
        {
          MessagesChats: newMessagesChat,
        },
      ],
    };
  }
  return {
    ok: true,
    chatData: chatDataDecrypted,
    hasMore: hasMore,
    cursor: cursor,
  };
}
type resultHistory =
  | { ok: false }
  | { ok: true; newCursor: string; hasMore: boolean; newMessages: IMessages[] };
export async function getHistoryMessages(
  chatId: string,
  login: string,
  cursor: string,
): Promise<resultHistory> {
  const pageSize = 50;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (!token) {
    return { ok: false };
  }
  const validToken = validateJWT(token.value);
  if (!validToken || typeof validToken === "string") {
    return { ok: false };
  }
  const historyMessages = await prisma.chats.findUnique({
    where: {
      id: chatId,
      Users: {
        some: { login: login },
      },
      AND: {
        Users: {
          some: {
            login: validToken.login,
          },
        },
      },
    },
    select: {
      MessagesChats: {
        where: { id: { lt: cursor } },
        select: { id: true, text: true, authorId: true, createdAt: true },
        take: pageSize + 1,
        orderBy: { id: "desc" },
      },
    },
  });
  if (
    !historyMessages ||
    !historyMessages.MessagesChats ||
    historyMessages.MessagesChats.length === 0
  ) {
    return { ok: false };
  }
  const hasMore = historyMessages.MessagesChats.length > pageSize;
  if (hasMore) {
    historyMessages.MessagesChats.pop();
  }
  const newCursor = historyMessages.MessagesChats.at(-1)?.id || "";
  const newMessages: IMessages[] = [];
  historyMessages.MessagesChats.map(async (mess) => {
    const message = mess.text;
    const decryptedMessage = await decrypt(message);
    const newMessage = {
      ...mess,
      text: decryptedMessage,
    };
    newMessages.push(newMessage);
  });
  return {
    ok: true,
    newCursor,
    newMessages: newMessages,
    hasMore,
  };
}
const algorithm = "aes-256-gcm";
const key = Buffer.from(process.env.KEY_CRYPTO!, "hex");
export async function decrypt(data: string) {
  const dataJson: { iv: string; content: string; authTag: string } =
    JSON.parse(data);
  const { iv, content, authTag } = dataJson;
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, "hex"),
  );
  decipher.setAuthTag(Buffer.from(authTag, "hex"));
  let decrypted = decipher.update(content, "hex", "utf-8");
  decrypted += decipher.final("utf-8");
  return decrypted;
}
