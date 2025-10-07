export interface IFormInput {
  type: string;
  placeholder: string;
  id: string;
  autoComplete?:string;
  pattern?:RegExp;
  min?:number;
  max?:number;
  reason?:string;
}
export const loginInputs: IFormInput[] = [
  {
    type: 'text',
    placeholder: 'Логин',
    id:'login',
    autoComplete:'name',
  },
  {
    type:'password',
    placeholder: 'Пароль',
    id:'password',
    autoComplete:'current-password',
  }
]
export const registerInputs: IFormInput[] = [
  {
    type: 'text',
    placeholder: 'Логин',
    id: 'login',
    autoComplete:'name',
    pattern:/^[a-zA-Z0-9]+$/,
    min:6,
    max:25,
    reason: 'Допускаются логины от 6 до 25 символов включительно, содержащие только латинские буквы и цифры'
  },
  {
    type: 'password',
    placeholder: 'Пароль',
    id: 'password',
    autoComplete:'new-password',
    min:8,
    reason:'Пароль не может быть меньше 8 символов'
  },
  {
    type: 'text',
    placeholder: 'Почта',
    id: 'email',
    autoComplete:'email',
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    reason:'Некорректная почта'
  }
]