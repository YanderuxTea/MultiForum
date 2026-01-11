import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  const body = await req.json();
  const { themeId, subCategoryId, pageNumber } = body;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  const category = await prisma.categories.findFirst({
    where: { subCategories: { some: { id: subCategoryId } } },
    select: { visible: true },
  });
  if (category && category.visible === "Admin" && !token) {
    return NextResponse.json(
      { ok: false, error: "у вас недостаточно прав на просмотр данной темы" },
      { status: 403 }
    );
  } else if (token && category && category.visible === "Admin") {
    const validToken = validateJWT(token.value);
    if (
      typeof validToken === "string" ||
      !validToken ||
      validToken.role === "User"
    ) {
      return NextResponse.json(
        { ok: false, error: "у вас недостаточно прав на просмотр данной темы" },
        { status: 403 }
      );
    }
  }
  const subCategoryCheck = await prisma.subCategories.findUnique({
    where: { id: subCategoryId },
    select: { visible: true, id: true, title: true },
  });
  const pageSize = 20;
  if (!subCategoryCheck) {
    return NextResponse.json(
      { ok: false, error: "такой темы нет" },
      { status: 404 }
    );
  }
  if (!token) {
    if (!subCategoryCheck.visible) {
      return NextResponse.json(
        { ok: false, error: "у вас недостаточно прав для просмотра этой темы" },
        { status: 403 }
      );
    } else {
      const messages = await prisma.messagesPosts.findMany({
        where: { idPosts: themeId },
        orderBy: { createdAt: "asc" },
        include: {
          reactions: {
            select: {
              reactionType: true,
              id: true,
              createdAt: true,
              messagesPostsId: true,
              fromUser: {
                select: {
                  id: true,
                  login: true,
                  avatar: true,
                  role: true,
                },
              },
            },
          },
          Users: {
            select: {
              login: true,
              avatar: true,
              role: true,
              _count: { select: { MessagesPosts: true } },
            },
          },
          HistoryMessage: {
            select: { updateAt: true },
            orderBy: { updateAt: "desc" },
            take: 1,
          },
          Posts: {
            select: {
              title: true,
              user: { select: { login: true, avatar: true, role: true } },
              locked: true,
              createdAt: true,
              _count: { select: { MessagesPosts: true } },
            },
          },
        },
        take: pageSize,
        skip: pageNumber * 20,
      });
      if (messages.length === 0) {
        return NextResponse.json({ ok: false, error: "Такой темы нет" });
      }
      return NextResponse.json({
        ok: true,
        data: messages,
        subCat: subCategoryCheck,
      });
    }
  }
  const validToken = validateJWT(token.value);
  if (!validToken || typeof validToken === "string") {
    return NextResponse.json({ ok: false, error: "неизвестная ошибка" });
  }
  if (!subCategoryCheck.visible && validToken.role === "User") {
    return NextResponse.json(
      { ok: false, error: "у вас недостаточно прав для просмотра этой темы" },
      { status: 403 }
    );
  }
  const messages = await prisma.messagesPosts.findMany({
    where: { idPosts: themeId },
    orderBy: { createdAt: "asc" },
    include: {
      reactions: {
        select: {
          messagesPostsId: true,

          reactionType: true,
          id: true,
          createdAt: true,
          fromUser: {
            select: {
              id: true,
              login: true,
              avatar: true,
              role: true,
            },
          },
        },
      },
      Users: {
        select: {
          login: true,
          avatar: true,
          role: true,
          _count: { select: { MessagesPosts: true } },
        },
      },
      HistoryMessage: {
        select: { updateAt: true },
        orderBy: { updateAt: "desc" },
        take: 1,
      },
      Posts: {
        select: {
          title: true,
          user: { select: { login: true, avatar: true, role: true } },
          locked: true,
          createdAt: true,
          _count: { select: { MessagesPosts: true } },
        },
      },
    },
    take: pageSize,
    skip: pageNumber * 20,
  });
  if (messages.length === 0) {
    return NextResponse.json({ ok: false, error: "Такой темы нет" });
  }
  return NextResponse.json({
    ok: true,
    data: messages,
    subCat: subCategoryCheck,
  });
}
