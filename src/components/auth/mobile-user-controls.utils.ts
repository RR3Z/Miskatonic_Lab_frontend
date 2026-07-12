type UserIdentity = {
  fullName?: string | null
  primaryEmailAddress?: { emailAddress: string } | null
  username?: string | null
}

export function getMobileUserDisplayName(user: UserIdentity) {
  return (
    user.fullName?.trim() ||
    user.username?.trim() ||
    user.primaryEmailAddress?.emailAddress ||
    "Профиль"
  )
}

export function openProfileAfterNavigation(
  onNavigate: () => void,
  openUserProfile: () => void,
) {
  onNavigate()
  return setTimeout(openUserProfile, 0)
}
