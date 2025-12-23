import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export interface IProfileProps {
  login: string;
  role: string;
  avatar: string | null;
  createdAt: Date;
  bans: {
    date: Date;
    time: number;
  }[];
  _count: {
    warns: number;
    bans: number;
    MessagesPosts: number;
  };
}
export async function POST(req: Request) {
  const body = await req.json();
  const { login } = body;
  const data = await prisma.users.findUnique({
    where: { login: login },
    select: {
      login: true,
      role: true,
      createdAt: true,
      avatar: true,
      _count: {
        select: {
          bans: { where: { Unbans: null } },
          warns: { where: { Unwarns: null } },
          MessagesPosts: true,
        },
      },
      bans: {
        where: { Unbans: null },
        orderBy: { date: "desc" },
        take: 1,
        select: { date: true, time: true },
      },
    },
  });
  return NextResponse.json({ ok: true, data: data });
}
