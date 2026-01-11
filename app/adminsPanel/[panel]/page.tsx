import { adminsPanelData } from "@/data/adminsPanelData";
import { notFound, redirect } from "next/navigation";
import { roleManagementData } from "@/data/roleManagementData";
import { punishmentManagementData } from "@/data/punishmentManagementData";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ panel: string }>;
}): Promise<Metadata> {
  const { panel } = await params;
  return {
    title:
      panel === "main"
        ? "Multi Forum | Главная"
        : panel === "VerifyUsers"
        ? "Multi Forum | Подтверждение пользователей"
        : panel === "RoleManagement"
        ? "Multi Forum | Управление ролями"
        : panel === "AvatarManagement"
        ? "Multi Forum | Удаление аватарок"
        : panel === "PunishmentManagement"
        ? "Multi Forum | Управление наказаниями"
        : panel === "ReputationManagement"
        ? "Multi Forum | Управление репутацией"
        : "Multi Forum",
    robots: "noindex, nofollow",
    description:
      "Панель администратора Multi Forum. Управление пользователями, контентом и настройками безопасности форума.",
  };
}
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ panel: string }>;
  searchParams: Promise<{ query: string; searchParams: string }>;
}) {
  const { panel } = await params;
  if (!adminsPanelData.some((panelData) => panelData.url === panel)) {
    notFound();
  }
  const searchParamsConst = (await searchParams).searchParams;
  const panelOut = adminsPanelData.find((item) => item.url === panel);
  if (
    panelOut?.url === "RoleManagement" &&
    !roleManagementData.some((data) => searchParamsConst === data.searchParams)
  ) {
    redirect(panelOut.url + "?searchParams=users");
  } else if (
    panelOut?.url === "PunishmentManagement" &&
    !punishmentManagementData.some(
      (data) => searchParamsConst === data.searchParams
    )
  ) {
    redirect(panelOut.url + "?searchParams=unbanned");
  }
  return panelOut && <panelOut.JSX />;
}
