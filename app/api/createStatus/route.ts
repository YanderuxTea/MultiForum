import { validateJWT } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";
import { rateLimiterCreateStatus } from "@/proxy";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
const schemaText = z.object({
  login: z.string(),
  text: z.string().trim().min(1).max(100),
});
export async function POST(req: Request) {
  const body = await req.json();
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  const validation = schemaText.safeParse(body);
  const checkLimit = await rateLimiterCreateStatus(req);
  if (checkLimit) {
    return checkLimit;
  }
  if (!validation.success) {
    return NextResponse.json({
      ok: false,
      error: "длина сообщения не может быть меньше 1 и не больше 100 символов",
    });
  }
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "Недостаточно прав" },
      { status: 403 }
    );
  }
  const { login, text } = validation.data;
  const validToken = validateJWT(token.value);
  if (!validToken || typeof validToken === "string") {
    return NextResponse.json(
      { ok: false, error: "Недостаточно прав" },
      { status: 403 }
    );
  }
  if (validToken.login !== login || validToken.verifyAdm !== "Yes") {
    return NextResponse.json(
      { ok: false, error: "Недостаточно прав" },
      { status: 403 }
    );
  }
  const activity = await prisma.$transaction(async (trx) => {
    const newStatus = await trx.statuses.create({
      data: { text: text, idUser: validToken.id },
    });
    const idStatus = newStatus.id;
    const newActivity = await trx.activityUser.create({
      data: {
        activityType: "status",
        idUser: validToken.id,
        statusId: idStatus,
      },
      select: {
        id: true,
        activityType: true,
        mess: true,
        status: { select: { id: true, text: true, createdAt: true } },
      },
    });
    return newActivity;
  });
  return NextResponse.json({ ok: true, activity: activity });
}
