import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
  const body = await req.json();
  const { login } = body;
  try {
    const lastSeen = await prisma.users.findUnique({
      where: { login: login },
      select: { lastSeen: true },
    });
    return NextResponse.json({ ok: true, lastSeen: lastSeen }, { status: 200 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
