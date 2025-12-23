import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { pageNumber } = body;
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
  const users = await prisma.users.findMany({
    where: { role: { not: "Admin" } },
    select: { id: true, login: true, role: true, avatar: true },
    take: pageSize,
    skip: pageNumber * pageSize,
  });
  const count = await prisma.users.count({ where: { role: { not: "Admin" } } });
  return NextResponse.json({ ok: true, users: users, count: count });
}
