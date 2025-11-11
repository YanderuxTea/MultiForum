import {IInputsSelectRoleData} from '@/data/inputsSelectRoleData'

export default function InputsSelectRoleUsers({props, role, pending}:{props:IInputsSelectRoleData, role:string, pending:boolean}) {
  return <label htmlFor={props.id} className='group cursor-pointer w-full'>
    <input disabled={pending} type='radio' name={props.name} id={props.id} value={props.value} defaultChecked={role===props.value} className='hidden' autoComplete={'off'}/>
    <div className='group-has-checked:bg-blue-500 dark:group-has-checked:bg-blue-600 group-has-checked:border-transparent border border-neutral-300 dark:border-neutral-700 px-2.5 py-1.25 rounded-md transition-colors duration-300 ease-out hover:group-has-checked:bg-blue-500 dark:hover:group-has-checked:bg-blue-600 hover:bg-neutral-200 dark:hover:bg-neutral-700  group-has-disabled:bg-neutral-300 dark:group-has-disabled:bg-neutral-700 group-has-disabled:group-has-checked:bg-neutral-500 dark:group-has-disabled:group-has-checked:bg-neutral-600 group-has-disabled:hover:bg-neutral-300 dark:group-has-disabled:hover:bg-neutral-700 group-has-disabled:group-has-checked:hover:bg-neutral-500 dark:group-has-disabled:group-has-checked:hover:bg-neutral-600 group-has-disabled:cursor-default'>
      <p className='select-none transition-colors duration-300 ease-out text-neutral-900 dark:text-neutral-100 group-has-checked:text-white font-medium'>
        {props.label}
      </p>
    </div>
  </label>
}