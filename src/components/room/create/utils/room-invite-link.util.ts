import { appRoutes } from "@/lib/routes/app-routes"
import type { Room } from "@/types/room"

export function roomInviteLink(room: Room) {
  const origin = typeof window === "undefined" ? "" : window.location.origin
  return `${origin}${appRoutes.room(room.id)}?invite=${encodeURIComponent(room.invite_token)}`
}
