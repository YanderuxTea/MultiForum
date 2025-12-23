import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { query, pageNumber } = body;
  const pageSize = 5;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (!token) {
    return NextResponse.json({ ok: false, message: "неизвестная ошибка" });
  }
  const validToken = validateJWT(token.value);
  if (
    !validToken ||
    typeof validToken === "string" ||
    validToken.role === "User"
  ) {
    return NextResponse.json({ ok: false, message: "неизвестная ошибка" });
  }
  const users = await prisma.users.findMany({
    where: { login: { contains: query, mode: "insensitive" } },
    select: { id: true, login: true, avatar: true, role: true },
    take: pageSize,
    skip: pageNumber * pageSize,
  });
  const count = await prisma.users.count({
    where: { login: { contains: query, mode: "insensitive" } },
  });
  return NextResponse.json({ ok: true, users, count });
}
