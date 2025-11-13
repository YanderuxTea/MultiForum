export default function useCheckingStaff({role}: {role: string}) {
  const checkStaff = role === 'Admin' || role === 'Moderator'
  const isAdmin = role === 'Admin'
  const isModerator = role === 'Moderator'
  const ModeratorsRoutes = ['main', 'AvatarManagement', 'PunishmentManagement']
  return {checkStaff, isAdmin, isModerator, ModeratorsRoutes}
}