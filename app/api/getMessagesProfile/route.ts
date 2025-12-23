import { prisma } from "@/lib/prisma";
import { JSONContent } from "@tiptap/core";
import { NextResponse } from "next/server";
export interface IProfileMessage {
  id: string;
  createdAt: Date;
  Posts: {
    id: string;
    _count: {
      MessagesPosts: number;
    };
    title: string;
    locked: boolean;
    SubCategories: {
      id: string;
      title: string;
    };
  };
  text: JSONContent;
  Users: {
    login: string;
    role: string;
    avatar: string | null;
  };
}
export async function POST(req: Request) {
  const body = await req.json();
  const { login, pageNumber } = body;
  const pageSize = 25;
  const messages = await prisma.users.findUnique({
    where: { login: login },
    select: {
      MessagesPosts: {
        take: pageSize,
        skip: pageSize * pageNumber,
        where: {
          AND: [
            { Posts: { SubCategories: { visible: true } } },
            { Posts: { SubCategories: { Categories: { visible: "All" } } } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          Users: {
            select: {
              login: true,
              avatar: true,
              role: true,
            },
          },
          createdAt: true,
          text: true,
          Posts: {
            select: {
              locked: true,
              title: true,
              id: true,
              SubCategories: {
                select: {
                  id: true,
                  title: true,
                },
              },
              _count: {
                select: {
                  MessagesPosts: true,
                },
              },
            },
          },
        },
      },
    },
  });
  return NextResponse.json({ ok: true, messages: messages });
}
