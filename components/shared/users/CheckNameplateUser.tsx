import AdminNameplate from '@/components/shared/nameplates/AdminNameplate'
import ModeratorNameplate from '@/components/shared/nameplates/ModeratorNameplate'
import UserNameplate from '@/components/shared/nameplates/UserNameplate'

export default function CheckNameplateUser({role}:{role:string }) {
  return role==='Admin'?<AdminNameplate/>:role==='Moderator'?<ModeratorNameplate/>:<UserNameplate/>
}