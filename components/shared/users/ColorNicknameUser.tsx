export default function ColorNicknameUser({user, fontSize, fontWeight}:{user:{role:string,login:string}, fontSize:number, fontWeight:number}) {
  return <p className={`font-bold ${user.role==='Admin'?'text-red-600':user.role==='Moderator'?'text-[#00BE00]':'text-neutral-700 dark:text-neutral-300'}`} style={{fontSize:`${fontSize}px`, fontWeight:fontWeight}}>{user.login}</p>
}