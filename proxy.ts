import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { deleteToken, validateJWT, validateTwoFactor } from "@/lib/jwt";
import { prisma } from "@/lib/prisma";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});
const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "40 s"),
  ephemeralCache: new Map(),
  prefix: "ratelimit:rate",
});
const rateLimitRecovery = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  ephemeralCache: new Map(),
  prefix: "ratelimit:recovery",
});
const rateLimitSearch = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "30 s"),
  ephemeralCache: new Map(),
  prefix: "ratelimit:search",
});
const rateLimitCreateStatus = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "180s"),
  ephemeralCache: new Map(),
  prefix: "ratelimit:createStatus",
});
const rateLimitCreateAnswer = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, "60 s"),
  ephemeralCache: new Map(),
  prefix: "ratelimit:createAnswer",
});
export async function proxy(req: NextRequest) {
  const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.vercel-insights.com https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' https://*.imgur.com https://i.ytimg.com data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src 'self' https://www.youtube.com/;
 `;
  const cspValue = cspHeader.replace(/\n/g, " ").trim();
  const reqHeaders = new Headers(req.headers);
  reqHeaders.set("Content-Security-Policy", cspValue);
  reqHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
  const responseWithCsp = NextResponse.next({
    request: {
      headers: reqHeaders,
    },
  });
  responseWithCsp.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  responseWithCsp.headers.set("Content-Security-Policy", cspValue);
  const url = req.nextUrl.pathname;

  if (url.startsWith("/_next") || url.includes("/api/getDataUser")) {
    return responseWithCsp;
  }
  if (
    url === "/api/login" ||
    url === "/api/register" ||
    url === "/api/verifyEmail" ||
    url === "/api/sendRecoveryCode" ||
    url === "/api/confirmRecoveryCode" ||
    url === "/api/changeAvatar" ||
    url === "/api/refreshData" ||
    url === "/api/changePassword" ||
    url === "/api/getDeviceList" ||
    url === "/api/twoFactor/confirm"
  ) {
    const response = await rateLimiterMiddleware(req);
    if (response) {
      return response;
    }
  }

  if (url === "/api/resetPassword") {
    const response = await rateLimiterRecovery(req);
    if (response) {
      return response;
    }
  }
  const tokenResponse = await tokenMiddleware(req, responseWithCsp);
  if (tokenResponse) {
    return tokenResponse;
  }

  return responseWithCsp;
}
export async function rateLimiterCreateStatus(req: Request) {
  const ip = req.headers.get("x-forwarder-for") ?? "anonymous";
  const { success, reset } = await rateLimitCreateStatus.limit(ip);
  if (!success) {
    const now = Date.now();
    const timeLeft = Math.floor((reset - now) / 1000);
    return NextResponse.json(
      { ok: false, error: timeLeft, status: 429 },
      { status: 429 }
    );
  }
}
export async function rateLimiterCreateAnswer(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success, reset } = await rateLimitCreateAnswer.limit(ip);
  if (!success) {
    const now = Date.now();
    const timeLeft = Math.floor((reset - now) / 1000);
    return NextResponse.json({ error: timeLeft, status: 429 }, { status: 429 });
  }
}
export async function rateLimiterSearch(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success, reset } = await rateLimitSearch.limit(ip);
  if (!success) {
    const now = Date.now();
    const timeLeft = Math.floor((reset - now) / 1000);
    return NextResponse.json(
      { ok: false, error: timeLeft, status: 429 },
      { status: 429 }
    );
  }
}
async function rateLimiterRecovery(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await rateLimitRecovery.limit(ip);
  if (!success) {
    return NextResponse.json(
      { ok: false, error: "Слишком много запросов" },
      { status: 429 }
    );
  }
}
async function rateLimiterMiddleware(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  const { success } = await rateLimit.limit(ip);
  if (!success) {
    return NextResponse.json(
      { ok: false, error: "Слишком много запросов" },
      { status: 429 }
    );
  }
}
async function tokenMiddleware(
  req: NextRequest,
  responseWithCsp: NextResponse
) {
  const publicRoute = ["/auth/login", "/auth/register", "/recovery"];
  const secureRoute = ["/settings"];
  const adminsRoute = ["/adminsPanel"];
  const ModeratorsRoutes = [
    "/main",
    "/AvatarManagement",
    "/PunishmentManagement",
  ];
  const cookieStorage = await cookies();
  const tokenHas = cookieStorage.has("token");
  const dIdHas = cookieStorage.has("dId");
  if (
    (!tokenHas &&
      secureRoute.some((route) => req.nextUrl.pathname.startsWith(route))) ||
    (!tokenHas &&
      adminsRoute.some((route) => req.nextUrl.pathname.startsWith(route)))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!tokenHas && !dIdHas) {
    return responseWithCsp;
  }
  if (tokenHas && !dIdHas) {
    await prisma.devices.deleteMany({
      where: { token: cookieStorage.get("token")?.value },
    });
    await deleteToken(req);
    return NextResponse.redirect(new URL("/invalid", req.url));
  }
  if (tokenHas && publicRoute.includes(req.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const dId = cookieStorage.get("dId")!.value;
  const token = cookieStorage.get("token")?.value;
  if (!token && req.nextUrl.pathname === "/banned") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  if (!token) {
    return responseWithCsp;
  }
  const validateToken = validateJWT(token);
  const validateUser = await prisma.devices.findUnique({
    where: { deviceId: dId, token: token },
  });
  if (!validateUser || !validateToken) {
    await prisma.devices.deleteMany({
      where: { OR: [{ deviceId: dId }, { token: token }] },
    });
    cookieStorage.delete("dId");
    cookieStorage.delete("token");
    cookieStorage.delete("2fa");
    return NextResponse.redirect(new URL("/invalid", req.url));
  }
  if (typeof validateToken !== "string") {
    const bans = await prisma.bans.findMany({
      where: { idUser: validateToken.id, Unbans: null },
      orderBy: { date: "desc" },
      take: 1,
    });
    if (bans.length > 0) {
      const isBanned =
        new Date(bans[0].date).getTime() + bans[0].time * 60 * 1000 >
          Date.now() || bans[0].time === 0;
      const reason = req.nextUrl.searchParams.get("reason");
      const time = req.nextUrl.searchParams.get("time");
      const banEnd = req.nextUrl.searchParams.get("banEnd");
      const admin = req.nextUrl.searchParams.get("admin");
      if (
        isBanned &&
        req.nextUrl.pathname !== "/api/logout" &&
        req.nextUrl.pathname !== "/api/twoFactor/validateTwoFactor" &&
        req.nextUrl.pathname !== "/api/categories/get" &&
        !req.nextUrl.pathname.startsWith("/_next") &&
        req.nextUrl.pathname !== "/api/twoFactor/confirm" &&
        (req.nextUrl.pathname !== "/banned" ||
          [...req.nextUrl.searchParams].length < 4 ||
          reason !== bans[0].reason ||
          time !== bans[0].time.toString() ||
          banEnd !==
            (
              new Date(bans[0].date).getTime() +
              bans[0].time * 60 * 1000
            ).toString() ||
          admin !== bans[0].admin)
      ) {
        const params = new URLSearchParams({
          reason: bans[0].reason,
          admin: bans[0].admin,
          time: String(bans[0].time),
          banEnd: String(
            new Date(bans[0].date).getTime() + bans[0].time * 60 * 1000
          ),
        });
        const url = `/banned?${params.toString()}`;
        return NextResponse.redirect(new URL(url, req.url));
      } else if (!isBanned && req.nextUrl.pathname === "/banned") {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (
        validateToken.verifyEmail !== "Verify" &&
        req.nextUrl.pathname !== "/" &&
        req.nextUrl.pathname !== "/api/logout" &&
        !(
          req.nextUrl.pathname.startsWith("/_next") ||
          req.nextUrl.pathname.includes("/api")
        )
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      const confirm2fa = cookieStorage.get("2fa")?.value;
      if (confirm2fa) {
        const valid2fa = validateTwoFactor(confirm2fa);
        if (valid2fa && typeof valid2fa !== "string") {
          if (
            !valid2fa.confirm &&
            req.nextUrl.pathname !== "/" &&
            !req.nextUrl.pathname.startsWith("/banned") &&
            req.nextUrl.pathname !== "/api/logout" &&
            !(
              req.nextUrl.pathname.startsWith("/_next") ||
              req.nextUrl.pathname === "/api/categories/get" ||
              req.nextUrl.pathname === "/api/twoFactor/validateTwoFactor" ||
              req.nextUrl.pathname === "/api/twoFactor/confirm"
            )
          ) {
            return NextResponse.redirect(new URL("/", req.url));
          }
        }
      } else if (!confirm2fa && validateToken.isTwoFactor) {
        cookieStorage.delete("dId");
        cookieStorage.delete("token");
        await prisma.devices.delete({ where: { deviceId: dId } });
        return NextResponse.redirect(new URL("/invalid", req.url));
      }
    }
  }
  if (typeof validateToken !== "string") {
    const checkStaff =
      validateToken.role === "Admin" || validateToken.role === "Moderator";
    const isModerator = validateToken.role === "Moderator";
    if (
      !checkStaff &&
      adminsRoute.some((route) => req.nextUrl.pathname.startsWith(route))
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    if (
      isModerator &&
      req.nextUrl.pathname.startsWith("/adminsPanel") &&
      !ModeratorsRoutes.some((route) => req.nextUrl.pathname.endsWith(route))
    ) {
      return NextResponse.redirect(new URL("/adminsPanel/main", req.url));
    }
  }
  return responseWithCsp;
}
