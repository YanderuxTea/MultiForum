import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
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
  if (typeof validToken === "string") {
    return NextResponse.json({ ok: false, message: "No token provided." });
  }
  const loginAdmin = validToken.login;
  const body = await req.json();
  const { id, reason, time } = body;
  const dateUnban = time === 0 ? null : new Date(Date.now() + time * 60 * 1000);
  const createBan = await prisma.bans.create({
    data: {
      idUser: id,
      reason: reason,
      time: time,
      admin: loginAdmin,
      unbansDate: dateUnban,
    },
    include: { Unbans: true },
  });
  return NextResponse.json({ ok: true, message: "Успешно", result: createBan });
}
