import { appRoutes } from "@/lib/routes/app-routes"

export function roomInviteLink(roomId: string, inviteToken: string) {
  const origin = typeof window === "undefined" ? "" : window.location.origin
  return `${origin}${appRoutes.room(roomId)}?invite=${encodeURIComponent(inviteToken)}`
}
