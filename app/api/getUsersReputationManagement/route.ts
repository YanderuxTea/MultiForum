import { users } from "./../../generated/prisma/index.d";
import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { pageNumber, query } = body;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  const pageSize = 5;
  if (!token) {
    return NextResponse.json({ ok: false, error: "неизвестная ошибка" });
  }
  const validToken = validateJWT(token.value);
  if (
    !validToken ||
    typeof validToken === "string" ||
    validToken.role !== "Admin"
  ) {
    return NextResponse.json({ ok: false, error: "неизвестная ошибка" });
  }
  const [users, countUsers] = await prisma.$transaction(async (trx) => {
    const users = await trx.users.findMany({
      where: { login: { contains: query, mode: "insensitive" } },
      select: {
        login: true,
        reputation: true,
        role: true,
        avatar: true,
        id: true,
      },
      take: pageSize,
      skip: pageNumber * pageSize,
    });
    const countUsers = await trx.users.count({
      where: { login: { contains: query, mode: "insensitive" } },
    });
    return [users, countUsers];
  });
  return NextResponse.json({ ok: true, users: users, countUsers: countUsers });
}
