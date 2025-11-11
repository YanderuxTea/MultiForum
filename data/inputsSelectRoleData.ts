export interface IInputsSelectRoleData {
  name: string,
  id: string,
  value: string,
  label: string,
}
export const inputsSelectRoleData:IInputsSelectRoleData[] = [
  {
    name:'selectUserRole',
    id:'selectUserRoleUser',
    value:'User',
    label:'Пользователь',
  },
  {
    name:'selectUserRole',
    id:'selectUserRoleModerator',
    value:'Moderator',
    label:'Модератор'
  },
  {
    name:'selectUserRole',
    id:'selectUserRoleAdmin',
    value:'Admin',
    label:'Администратор'
  }
]