import roomContentRu from "@/data/locales/ru/room/chat.ru.json"
import type { RoomSocketStatus } from "@/hooks/room/use-room-socket"

export function roomSocketStatusText(status: RoomSocketStatus) {
  if (status === "connected") return roomContentRu.chat.status.connected
  if (status === "connecting") return roomContentRu.chat.status.connecting
  if (status === "unsupported") return roomContentRu.chat.status.unsupported
  return roomContentRu.chat.status.disconnected
}
