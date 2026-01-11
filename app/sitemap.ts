import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

type SitemapEntry = MetadataRoute.Sitemap[number];
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const authTypes = ["login", "register"];
  const staticRoutesConst = ["recovery", "search", "", "about", "team"];
  const staticRoutes: SitemapEntry[] = staticRoutesConst.map((route) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));
  const authRoutes: SitemapEntry[] = authTypes.map((type) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}auth/${type}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.5,
  }));
  const users = await prisma.users.findMany({
    select: { login: true, createdAt: true },
  });
  const usersRoutes: SitemapEntry[] = users.map((userRoute) => ({
    url: `${process.env.NEXT_PUBLIC_SITE_URL}profile/${userRoute.login}`,
    lastModified: new Date(userRoute.createdAt),
    changeFrequency: "weekly",
    priority: 0.6,
  }));
  return [...staticRoutes, ...usersRoutes, ...authRoutes];
}
