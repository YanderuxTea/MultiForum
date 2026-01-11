export interface INavbarData {
  title: string;
  url: string;
}
export const navBarData: INavbarData[] = [
  {
    title: "Правила",
    url: `/theme/${decodeURIComponent(
      "Правила форума"
    )}?themeId=rulesForum&subCategoryId=rules`,
  },
  {
    title: "О форуме",
    url: "/about",
  },
  {
    title: "Команда",
    url: "/team",
  },
];
