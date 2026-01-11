import { JSONContent } from "@tiptap/core";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { validateJWT } from "@/lib/jwt";
import { z } from "zod";

const schemaTitle = z.object({
  title: z
    .string()
    .min(1)
    .max(50)
    .regex(/^[A-Za-zА-Яа-яЁё0-9\s]+$/),
});
export async function POST(req: Request) {
  const body: { title: string; data: JSONContent; id: string } =
    await req.json();
  const { title, data, id } = body;
  const res = schemaTitle.safeParse({ title: title });
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (title.trim().length > 50) {
    return NextResponse.json({
      ok: false,
      error: "название темы не может быть больше 50 символов",
    });
  }
  if (!res.success) {
    return NextResponse.json({
      ok: false,
      error: "нельзя использовать спец символы",
    });
  }
  if (!token) {
    return NextResponse.json({ ok: false, error: "неизвестная ошибка" });
  }
  const validToken = validateJWT(token.value);
  if (
    !validToken ||
    typeof validToken === "string" ||
    validToken.verifyAdm !== "Yes"
  ) {
    return NextResponse.json({ ok: false, error: "неизвестная ошибка" });
  }
  const role = validToken.role;
  if (!title || !data || !id) {
    return NextResponse.json({ res: false, error: "вы не заполнили поля" });
  }
  const subCategory = await prisma.subCategories.findUnique({
    where: { id: id },
  });
  if (!subCategory) {
    return NextResponse.json({ res: false, error: "неизвестная ошибка" });
  }
  if ((!subCategory.visible || !subCategory.change) && role !== "Admin") {
    return NextResponse.json({ res: false, error: "неизвестная ошибка" });
  }
  const idUser = validToken.id;

  const theme = await prisma.posts.create({
    data: {
      idSubCategories: id,
      idUser: idUser,
      title: title,
      MessagesPosts: {
        create: {
          idUser: idUser,
          text: data,
          activityUsers: {
            create: { idUser: idUser, activityType: "message" },
          },
        },
      },
    },
    include: { MessagesPosts: true },
  });
  return NextResponse.json({ ok: true, theme: theme });
}
