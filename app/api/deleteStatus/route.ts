import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { id, login } = body;
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "недостаточно прав" },
      { status: 403 }
    );
  }
  const validToken = validateJWT(token.value);
  if (!validToken || typeof validToken === "string") {
    return NextResponse.json(
      { ok: false, error: "недостаточно прав" },
      { status: 403 }
    );
  }
  if (validToken.login !== login && validToken.role !== "Admin") {
    return NextResponse.json(
      { ok: false, error: "недостаточно прав" },
      { status: 403 }
    );
  }
  await prisma.statuses.delete({ where: { id: id } });
  return NextResponse.json({ ok: true }, { status: 200 });
}
