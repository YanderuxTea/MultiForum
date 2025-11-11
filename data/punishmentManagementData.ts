interface IPunishmentManagementData {
  searchParams: string,
  title: string,
  url: string,
}
export const punishmentManagementData: IPunishmentManagementData[] = [
  {
    searchParams:'unbanned',
    title: 'Не заблокированные',
    url:'/adminsPanel/PunishmentManagement?searchParams=unbanned',
  },
  {
    searchParams:'banned',
    title: 'Заблокированные',
    url:'/adminsPanel/PunishmentManagement?searchParams=banned',
  }
]