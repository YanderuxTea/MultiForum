interface ISettingsList{
  title: string;
  url: string;
}
export const settingsList: ISettingsList[] = [{
  title:'Основные',
  url: 'main'
},
  {
    title: 'Безопасность',
    url: 'secure'
  },
  {
    title: 'Устройства',
    url: 'devices'
  }
  ]