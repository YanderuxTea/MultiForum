type PluralForms = [one:string, few:string, many:string];
export default function useDeclinationWord(count:number, [one, few, many]:PluralForms) {
  const abs = Math.abs(count)
  if(abs%100 >=11 && abs%100 <=14){
    return many
  }
  switch (abs%10){
    case 1: return one
    case 2:
      case 3:
        case 4: return few
    default:return many
  }
}