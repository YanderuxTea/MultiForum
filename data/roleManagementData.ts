export interface IRoleManagementData{
  searchParams: string;
  title: string;
  url: string;
}
export const roleManagementData: IRoleManagementData[] = [
  {
    searchParams:'users',
    title:'Пользователи',
    url:'/adminsPanel/RoleManagement?searchParams=users'
  },
  {
    searchParams:'moderators',
    title:'Модераторы',
    url:'/adminsPanel/RoleManagement?searchParams=moderators'
  },
  {
    searchParams:'admins',
    title:'Администраторы',
    url:'/adminsPanel/RoleManagement?searchParams=admins'
  }
]