import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
const schemaChangeRep = z.object({
  reputation: z.number().positive(),
  idUser: z.string(),
  action: z.enum(["up", "down"]),
});
export async function POST(req: Request) {
  const body = await req.json();
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
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
  const safeData = schemaChangeRep.safeParse(body);
  if (!safeData.success) {
    return NextResponse.json({ ok: false, error: "неизвестная ошибка" });
  }
  const { reputation, idUser, action } = safeData.data;
  const repIncr = action === "down" ? -reputation : reputation;
  const reputationBefore = await prisma.users.update({
    where: { id: idUser },
    data: { reputation: { increment: repIncr } },
    select: { reputation: true },
  });
  return NextResponse.json(
    {
      ok: true,
      reputation: reputationBefore.reputation,
      message: "Успешно",
    },
    { status: 200 }
  );
}
