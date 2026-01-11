import { JSX } from "react";
import MainPanel from "@/components/ui/adminspanels/MainPanel";
import VerifyUsersPanel from "@/components/ui/adminspanels/VerifyUsers";
import ManagementRolesPanel from "@/components/ui/adminspanels/RoleManagement";
import DeleteUsersAvatar from "@/components/ui/adminspanels/AvatarManagement";
import ManagementPunishmentPanel from "@/components/ui/adminspanels/PunishmentManagement";
import ReputationManagement from "@/components/ui/adminspanels/ReputationManagement";

export interface IAdminsPanelData {
  title: string;
  url: string;
  JSX: () => JSX.Element;
}
export const adminsPanelData: IAdminsPanelData[] = [
  {
    title: "Главная",
    url: "main",
    JSX: MainPanel,
  },
  {
    title: "Подтверждение пользователей",
    url: "VerifyUsers",
    JSX: VerifyUsersPanel,
  },
  {
    title: "Управление ролями пользователей",
    url: "RoleManagement",
    JSX: ManagementRolesPanel,
  },
  {
    title: "Удаление аватарок пользователей",
    url: "AvatarManagement",
    JSX: DeleteUsersAvatar,
  },
  {
    title: "Управление наказаниями",
    url: "PunishmentManagement",
    JSX: ManagementPunishmentPanel,
  },
  {
    title: "Управление репутацией",
    url: "ReputationManagement",
    JSX: ReputationManagement,
  },
];
