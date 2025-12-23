import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { validateJWT } from "@/lib/jwt";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, page } = body;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  const pageSize = 20;
  const category = await prisma.categories.findFirst({
    where: { subCategories: { some: { id: id } } },
    select: { visible: true },
  });
  if (category && category.visible === "Admin" && !token) {
    return NextResponse.json(
      {
        ok: false,
        error: "у вас недостаточно прав на просмотр данного раздела",
      },
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
        {
          ok: false,
          error: "у вас недостаточно прав на просмотр данного раздела",
        },
        { status: 403 }
      );
    }
  }
  const subCategory = await prisma.subCategories.findUnique({
    where: { id },
    select: { visible: true },
  });
  if (subCategory && !subCategory.visible && !token) {
    return NextResponse.json(
      {
        ok: false,
        error: "у вас недостаточно прав на просмотр данного раздела",
      },
      { status: 403 }
    );
  } else if (token && subCategory && !subCategory.visible) {
    const validToken = validateJWT(token.value);
    if (
      typeof validToken === "string" ||
      !validToken ||
      validToken.role === "User"
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: "у вас недостаточно прав на просмотр данного раздела",
        },
        { status: 403 }
      );
    }
  }
  if (page === 0) {
    const pinnedThemes = await prisma.subCategories.findUnique({
      where: { id: id },
      select: {
        title: true,
        id: true,
        change: true,
        _count: { select: { posts: true } },
        posts: {
          where: { pinned: true },
          orderBy: { createdAt: "desc" },
          select: {
            locked: true,
            pinned: true,
            title: true,
            id: true,
            lastUpdate: true,
            createdAt: true,
            user: { select: { login: true, role: true } },
            MessagesPosts: {
              select: {
                id: true,
                createdAt: true,
                Users: { select: { login: true, role: true, avatar: true } },
              },
              take: 1,
              orderBy: { createdAt: "desc" },
            },
            _count: { select: { MessagesPosts: true } },
          },
        },
      },
    });
    const themes = await prisma.subCategories.findUnique({
      where: { id: id },
      select: {
        title: true,
        id: true,
        change: true,
        _count: { select: { posts: true } },
        posts: {
          where: { pinned: false },
          orderBy: { lastUpdate: "desc" },
          select: {
            locked: true,
            pinned: true,
            title: true,
            id: true,
            lastUpdate: true,
            createdAt: true,
            user: { select: { login: true, role: true } },
            MessagesPosts: {
              select: {
                id: true,
                createdAt: true,
                Users: { select: { login: true, role: true, avatar: true } },
              },
              take: 1,
              orderBy: { createdAt: "desc" },
            },
            _count: { select: { MessagesPosts: true } },
          },
          take: pinnedThemes ? pageSize - pinnedThemes.posts.length : pageSize,
          skip: 0,
        },
      },
    });
    if (!pinnedThemes || !themes) {
      return NextResponse.json({ ok: true });
    }
    const themesFull = {
      id: pinnedThemes.id,
      title: pinnedThemes.title,
      _count: pinnedThemes._count,
      change: pinnedThemes.change,
      posts: [...(pinnedThemes.posts ?? []), ...(themes.posts ?? [])],
    };
    return NextResponse.json({ ok: true, data: themesFull });
  } else {
    const pinnedThemes = await prisma.posts.count({
      where: { idSubCategories: id, pinned: true },
    });
    const themes = await prisma.subCategories.findUnique({
      where: { id: id },
      select: {
        title: true,
        id: true,
        change: true,
        _count: { select: { posts: true } },
        posts: {
          where: { pinned: false },
          orderBy: { lastUpdate: "desc" },
          select: {
            locked: true,
            pinned: true,
            title: true,
            id: true,
            lastUpdate: true,
            createdAt: true,
            user: { select: { login: true, role: true } },
            MessagesPosts: {
              select: {
                id: true,
                createdAt: true,
                Users: { select: { login: true, role: true, avatar: true } },
              },
              take: 1,
              orderBy: { createdAt: "desc" },
            },
            _count: { select: { MessagesPosts: true } },
          },
          take: pageSize,
          skip: page * pageSize - pinnedThemes,
        },
      },
    });
    if (!themes) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: true, data: themes });
  }
}
