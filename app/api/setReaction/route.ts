import { ReactionType } from "@/context/CategoriesContext";
import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const {
    messageId,
    reactionType,
    toUserId,
    reactionId,
  }: {
    messageId: string;
    reactionType: ReactionType | "delete";
    toUserId: string;
    reactionId?: string;
  } = body;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (!token) {
    return NextResponse.json({ ok: false, error: "неизвестная ошибка" });
  }
  const validToken = validateJWT(token.value);
  if (!validToken || typeof validToken === "string") {
    return NextResponse.json({ ok: false, error: "неизвестная ошибка" });
  }

  if (reactionType !== "delete" && reactionId) {
    const reaction = await prisma.$transaction(async (trx) => {
      const laterReaction = await trx.reaction.delete({
        where: { id: reactionId },
      });
      const reaction = await trx.reaction.create({
        data: {
          toUserId: toUserId,
          reactionType: reactionType,
          fromUserId: validToken.id,
          messagesPostsId: messageId,
        },
        select: {
          createdAt: true,
          fromUser: {
            select: {
              avatar: true,
              id: true,
              login: true,
              role: true,
            },
          },
          toUser: {
            select: {
              id: true,
            },
          },
          id: true,
          messagesPostsId: true,
          reactionType: true,
        },
      });
      await trx.activityUser.create({
        data: {
          idUser: validToken.id,
          activityType: "reaction",
          reactionId: reaction.id,
        },
      });
      await trx.activityUser.create({
        data: {
          idUser: reaction.toUser.id,
          activityType: "reaction",
          reactionId: reaction.id,
        },
      });
      const reputationNew =
        reactionType === "down" ? -1 : reactionType === "like" ? 2 : 1;
      const reputationLater =
        laterReaction.reactionType === "down"
          ? -1
          : laterReaction.reactionType === "like"
            ? 2
            : 1;
      const reputationChange = reputationNew - reputationLater;
      await trx.users.update({
        where: { id: reaction.toUser.id },
        data: { reputation: { increment: reputationChange } },
      });
      return reaction;
    });
    return NextResponse.json({ ok: true, reaction: reaction });
  }
  if (reactionType === "delete") {
    await prisma.$transaction(async (trx) => {
      const reaction = await trx.reaction.delete({
        where: { id: reactionId },
        select: { reactionType: true, toUserId: true },
      });
      const reputation =
        reaction.reactionType === "down"
          ? 1
          : reaction.reactionType === "like"
            ? -2
            : -1;
      await trx.users.update({
        where: { id: reaction.toUserId },
        data: { reputation: { increment: reputation } },
      });
    });
    return NextResponse.json({ ok: true });
  } else {
    const currentDate = new Date(Date.now());
    currentDate.setHours(0, 0, 0, 0);
    const countReaction = await prisma.reaction.count({
      where: { fromUserId: validToken.id, createdAt: { gte: currentDate } },
    });
    if (countReaction >= 10) {
      return NextResponse.json({
        ok: false,
        error: "нельзя ставить больше 10 реакций за день",
      });
    }
    const reaction = await prisma.$transaction(async (trx) => {
      const reaction = await trx.reaction.create({
        data: {
          toUserId: toUserId,
          reactionType: reactionType,
          fromUserId: validToken.id,
          messagesPostsId: messageId,
        },
        select: {
          createdAt: true,
          fromUser: {
            select: {
              avatar: true,
              id: true,
              login: true,
              role: true,
            },
          },
          toUser: {
            select: { id: true },
          },
          id: true,
          messagesPostsId: true,
          reactionType: true,
        },
      });
      await trx.activityUser.create({
        data: {
          idUser: validToken.id,
          activityType: "reaction",
          reactionId: reaction.id,
        },
      });
      await trx.activityUser.create({
        data: {
          idUser: reaction.toUser.id,
          activityType: "reaction",
          reactionId: reaction.id,
        },
      });
      const reputation =
        reactionType === "down" ? -1 : reactionType === "like" ? 2 : 1;
      await trx.users.update({
        where: { id: reaction.toUser.id },
        data: { reputation: { increment: reputation } },
      });
      return reaction;
    });
    return NextResponse.json({ ok: true, reaction: reaction });
  }
}
