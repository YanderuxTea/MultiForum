import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const pageSize = 5;
  const { role, query, pageNumber } = body;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token")?.value;
  if (!token) {
    return NextResponse.json(
      { ok: false, message: "неизвестная ошибка" },
      { status: 401 }
    );
  }
  const validToken = validateJWT(token);
  if (
    !validToken ||
    typeof validToken === "string" ||
    validToken.role !== "Admin"
  ) {
    return NextResponse.json(
      { ok: false, message: "неизвестная ошибка" },
      { status: 401 }
    );
  }
  const findUsers = await prisma.users.findMany({
    where: {
      login: { contains: query, mode: "insensitive" },
      role: { equals: role, mode: "insensitive" },
    },
    select: { id: true, login: true, avatar: true, role: true },
    skip: pageNumber * pageSize,
    take: pageSize,
  });
  const counts = await prisma.users.groupBy({
    by: ["role"],
    where: {
      login: { contains: query, mode: "insensitive" },
    },
    _count: { role: true },
  });
  return NextResponse.json({ ok: true, users: findUsers, counts: counts });
}
