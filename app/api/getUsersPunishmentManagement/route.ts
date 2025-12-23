import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { pageNumber, search, searchParams } = body;
  const pageSize = 5;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (!token) {
    return NextResponse.json({ ok: false, message: "No token provided." });
  }
  const validToken = validateJWT(token.value);
  if (!validToken) {
    return NextResponse.json({ ok: false, message: "No token provided." });
  }
  if (typeof validToken === "object") {
    const checkStaff =
      validToken.role === "Admin" || validToken.role === "Moderator";
    if (!checkStaff) {
      return NextResponse.json({
        ok: false,
        message: "No permission to access.",
      });
    }
  }
  if (searchParams === "banned") {
    if (search.trim().length > 0) {
      const users = await prisma.users.findMany({
        where: {
          login: { contains: search, mode: "insensitive" },
          bans: {
            some: {
              OR: [
                {
                  Unbans: { is: null },
                  unbansDate: { gt: new Date(Date.now()) },
                },
                {
                  Unbans: { is: null },
                  time: 0,
                },
              ],
            },
          },
        },
        select: {
          id: true,
          login: true,
          role: true,
          avatar: true,
          bans: { include: { Unbans: true }, orderBy: { date: "desc" } },
          warns: { include: { Unwarns: true }, orderBy: { date: "desc" } },
        },
        take: pageSize,
        skip: pageNumber * pageSize,
      });
      const count = await prisma.users.count({
        where: {
          login: { contains: search, mode: "insensitive" },
          bans: {
            some: {
              OR: [
                {
                  Unbans: { is: null },
                  unbansDate: { gt: new Date(Date.now()) },
                },
                {
                  Unbans: { is: null },
                  time: 0,
                },
              ],
            },
          },
        },
      });
      return NextResponse.json({ ok: true, users: users, count: count });
    } else {
      const users = await prisma.users.findMany({
        where: {
          bans: {
            some: {
              OR: [
                {
                  Unbans: { is: null },
                  unbansDate: { gt: new Date(Date.now()) },
                },
                {
                  Unbans: { is: null },
                  time: 0,
                },
              ],
            },
          },
        },
        select: {
          id: true,
          login: true,
          role: true,
          avatar: true,
          bans: { include: { Unbans: true }, orderBy: { date: "desc" } },
          warns: { include: { Unwarns: true }, orderBy: { date: "desc" } },
        },
        take: pageSize,
        skip: pageNumber * pageSize,
      });
      const count = await prisma.users.count({
        where: {
          bans: {
            some: {
              OR: [
                {
                  Unbans: { is: null },
                  unbansDate: { gt: new Date(Date.now()) },
                },
                {
                  Unbans: { is: null },
                  time: 0,
                },
              ],
            },
          },
        },
      });
      return NextResponse.json({ ok: true, users: users, count: count });
    }
  } else if (searchParams === "unbanned") {
    if (search.trim().length > 0) {
      const users = await prisma.users.findMany({
        where: {
          login: { contains: search, mode: "insensitive" },
          OR: [
            {
              bans: {
                none: {
                  Unbans: null,
                  OR: [
                    { unbansDate: { gt: new Date(Date.now()) } },
                    { time: 0 },
                  ],
                },
              },
            },
            { bans: { none: {} } },
          ],
        },
        select: {
          id: true,
          login: true,
          role: true,
          avatar: true,
          bans: { include: { Unbans: true }, orderBy: { date: "desc" } },
          warns: { include: { Unwarns: true }, orderBy: { date: "desc" } },
        },
        take: pageSize,
        skip: pageNumber * pageSize,
      });
      const count = await prisma.users.count({
        where: {
          login: { contains: search, mode: "insensitive" },
          OR: [
            {
              bans: {
                none: {
                  Unbans: null,
                  OR: [
                    { unbansDate: { gt: new Date(Date.now()) } },
                    { time: 0 },
                  ],
                },
              },
            },
            { bans: { none: {} } },
          ],
        },
      });
      return NextResponse.json({ ok: true, users: users, count: count });
    } else {
      const users = await prisma.users.findMany({
        where: {
          OR: [
            {
              bans: {
                none: {
                  Unbans: null,
                  OR: [
                    { unbansDate: { gt: new Date(Date.now()) } },
                    { time: 0 },
                  ],
                },
              },
            },
            { bans: { none: {} } },
          ],
        },
        select: {
          id: true,
          login: true,
          role: true,
          avatar: true,
          bans: { include: { Unbans: true }, orderBy: { date: "desc" } },
          warns: { include: { Unwarns: true }, orderBy: { date: "desc" } },
        },
        take: pageSize,
        skip: pageNumber * pageSize,
      });
      const count = await prisma.users.count({
        where: {
          OR: [
            {
              bans: {
                none: {
                  Unbans: null,
                  OR: [
                    { unbansDate: { gt: new Date(Date.now()) } },
                    { time: 0 },
                  ],
                },
              },
            },
            { bans: { none: {} } },
          ],
        },
      });
      return NextResponse.json({ ok: true, users: users, count: count });
    }
  }
}
