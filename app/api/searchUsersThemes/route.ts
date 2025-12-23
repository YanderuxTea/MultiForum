import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { rateLimiterSearch } from "@/proxy";
import { JSONContent } from "@tiptap/core";
export interface IFoundUsers {
  id: string;
  login: string;
  role: string;
  avatar: string | null;
}
export interface IThemesSearch {
  id: string;
  createdAt: Date;
  MessagesPosts: {
    text: JSONContent;
  }[];
  _count: {
    MessagesPosts: number;
  };
  title: string;
  idSubCategories: string;
  locked: boolean;
  SubCategories: {
    id: string;
    title: string;
  };
  user: IFoundUsers;
}

export async function POST(req: Request) {
  const res = await rateLimiterSearch(req);
  if (res) {
    return res;
  }
  const body = await req.json();
  const { query, searchParams, pageNumber, typeSearch } = body;
  const pageSize = 10;
  if (!query.toString().trim() || !searchParams.toString().trim()) {
    return NextResponse.json({ ok: false });
  }
  if (searchParams.toString().trim() === "All") {
    if (typeSearch === "all") {
      const users = await prisma.users.findMany({
        where: { login: { contains: query.trim(), mode: "insensitive" } },
        select: {
          login: true,
          avatar: true,
          role: true,
          id: true,
        },
        take: pageSize,
        skip: pageSize * pageNumber,
        orderBy: {
          createdAt: "asc",
        },
      });
      const countUsers = await prisma.users.count({
        where: { login: { contains: query.trim(), mode: "insensitive" } },
      });
      const themes = await prisma.posts.findMany({
        where: {
          title: { contains: query.trim(), mode: "insensitive" },
          SubCategories: {
            visible: { not: false },
            Categories: { visible: { not: "Admin" } },
          },
        },
        select: {
          user: { select: { login: true, avatar: true, role: true } },
          createdAt: true,
          locked: true,
          _count: {
            select: {
              MessagesPosts: true,
            },
          },
          title: true,
          idSubCategories: true,
          id: true,
          SubCategories: { select: { title: true, id: true } },
          MessagesPosts: {
            select: {
              text: true,
            },
            take: 1,
            orderBy: { createdAt: "asc" },
          },
        },
        take: pageSize,
        skip: pageSize * pageNumber,
        orderBy: { createdAt: "desc" },
      });
      const countThemes = await prisma.posts.count({
        where: {
          title: { contains: query.trim(), mode: "insensitive" },
          SubCategories: {
            visible: { not: false },
            Categories: { visible: { not: "Admin" } },
          },
        },
      });
      return NextResponse.json({
        ok: true,
        users: users,
        themes: themes,
        countUsers: countUsers,
        countThemes: countThemes,
      });
    } else if (typeSearch === "users") {
      const users = await prisma.users.findMany({
        where: { login: { contains: query.trim(), mode: "insensitive" } },
        select: {
          login: true,
          avatar: true,
          role: true,
          id: true,
        },
        take: pageSize,
        skip: pageSize * pageNumber,
        orderBy: {
          createdAt: "asc",
        },
      });
      const countUsers = await prisma.users.count({
        where: { login: { contains: query.trim(), mode: "insensitive" } },
      });
      return NextResponse.json({
        ok: true,
        users: users,
        countUsers: countUsers,
      });
    } else if (typeSearch === "themes") {
      const themes = await prisma.posts.findMany({
        where: {
          title: { contains: query.trim(), mode: "insensitive" },
          SubCategories: {
            visible: { not: false },
            Categories: { visible: { not: "Admin" } },
          },
        },
        select: {
          user: { select: { login: true, avatar: true, role: true } },
          createdAt: true,
          locked: true,
          _count: {
            select: {
              MessagesPosts: true,
            },
          },
          title: true,
          idSubCategories: true,
          id: true,
          SubCategories: { select: { title: true, id: true } },
          MessagesPosts: {
            select: {
              text: true,
            },
            take: 1,
            orderBy: { createdAt: "asc" },
          },
        },
        take: pageSize,
        skip: pageSize * pageNumber,
        orderBy: { createdAt: "desc" },
      });
      const countThemes = await prisma.posts.count({
        where: {
          title: { contains: query.trim(), mode: "insensitive" },
          SubCategories: {
            visible: { not: false },
            Categories: { visible: { not: "Admin" } },
          },
        },
      });
      return NextResponse.json({
        ok: true,
        themes: themes,
        countThemes: countThemes,
      });
    }
  }
  if (searchParams.toString().trim() === "User" && typeSearch === "users") {
    const users = await prisma.users.findMany({
      where: { login: { contains: query.trim(), mode: "insensitive" } },
      select: {
        login: true,
        avatar: true,
        role: true,
        id: true,
      },
      take: pageSize,
      skip: pageSize * pageNumber,
      orderBy: {
        createdAt: "asc",
      },
    });
    const countUsers = await prisma.users.count({
      where: { login: { contains: query.trim(), mode: "insensitive" } },
    });
    return NextResponse.json({
      ok: true,
      users: users,
      countUsers: countUsers,
    });
  } else if (
    searchParams.toString().trim() === "Themes" &&
    typeSearch === "themes"
  ) {
    const themes = await prisma.posts.findMany({
      where: {
        title: { contains: query.trim(), mode: "insensitive" },
        SubCategories: {
          visible: { not: false },
          Categories: { visible: { not: "Admin" } },
        },
      },
      select: {
        user: { select: { login: true, avatar: true, role: true } },
        createdAt: true,
        locked: true,
        _count: {
          select: {
            MessagesPosts: true,
          },
        },
        title: true,
        idSubCategories: true,
        id: true,
        SubCategories: { select: { title: true, id: true } },
        MessagesPosts: {
          select: {
            text: true,
          },
          take: 1,
          orderBy: { createdAt: "asc" },
        },
      },
      take: pageSize,
      skip: pageSize * pageNumber,
      orderBy: { createdAt: "desc" },
    });
    const countThemes = await prisma.posts.count({
      where: {
        title: { contains: query.trim(), mode: "insensitive" },
        SubCategories: {
          visible: { not: false },
          Categories: { visible: { not: "Admin" } },
        },
      },
    });
    return NextResponse.json({
      ok: true,
      themes: themes,
      countThemes: countThemes,
    });
  }
}
