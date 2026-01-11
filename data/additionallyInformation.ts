export interface IAdditionalInformation {
  title: string;
  type: string;
}
export const additionalInformation: IAdditionalInformation[] = [
  {
    title: "Последние статусы",
    type: "statuses",
  },
  {
    title: "Лучшие авторы",
    type: "top",
  },
  {
    title: "Последние темы",
    type: "themes",
  },
  {
    title: "Статистика форума",
    type: "stats",
  },
];
