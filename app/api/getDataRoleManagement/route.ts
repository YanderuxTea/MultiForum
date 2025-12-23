import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { role, pageNumber } = body;
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
  if (typeof validToken === "object" && validToken.role !== "Admin") {
    return NextResponse.json({
      ok: false,
      message: "No permission to access.",
    });
  }
  const res = await prisma.users.findMany({
    where: { role: { equals: role, mode: "insensitive" } },
    select: { id: true, avatar: true, login: true, role: true },
    take: pageSize,
    skip: pageNumber * pageSize,
  });
  const counts = await prisma.users.groupBy({
    by: ["role"],
    _count: { role: true },
  });
  return NextResponse.json({ ok: true, users: res, counts: counts });
}
