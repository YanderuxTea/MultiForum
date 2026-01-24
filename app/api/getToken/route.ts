import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStorage = await cookies();
  const token = cookieStorage.get("token");
  return NextResponse.json({ token: token });
}
