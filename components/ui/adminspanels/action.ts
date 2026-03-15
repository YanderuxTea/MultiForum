"use server";
import { cookies } from "next/headers";
import { validateJWT } from "@/lib/jwt.ts";
import { prisma } from "@/lib/prisma.ts";

export async function deleteTheme(id: string) {
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  if (id.trim().length === 0) {
    return { ok: false, message: "введите id темы в поле" };
  }
  if (!token) {
    return { ok: false, message: "неизвестная ошибка" };
  }
  const validToken = validateJWT(token.value);
  if (
    !validToken ||
    typeof validToken === "string" ||
    validToken.role !== "Admin" ||
    !id
  ) {
    return { ok: false, message: "неизвестная ошибка" };
  }
  try {
    await prisma.posts.delete({ where: { id: id } });
    return { ok: true, message: "Успешно" };
  } catch {
    return { ok: false, message: "темы с таким id не найдено" };
  }
}
