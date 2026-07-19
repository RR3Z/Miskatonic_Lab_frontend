import { DoorOpen } from "lucide-react"
import Link from "next/link"
import { formatRoomCreatedAt } from "@/components/room/utils/format-room-created-at.util"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import roomContentRu from "@/data/room/room.ru.json"
import { appRoutes } from "@/lib/routes/app-routes"
import type { RoomSummary } from "@/types/room"

type RoomCatalogCardProps = {
  onJoin: (room: RoomSummary) => void
  room: RoomSummary
}

export function RoomCatalogCard({ onJoin, room }: RoomCatalogCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="line-clamp-2">{room.name}</CardTitle>
        <CardDescription>
          {formatRoomCreatedAt(room.created_at)}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm text-[var(--ml-ink-muted)]">
          <DoorOpen aria-hidden="true" className="size-4" />
          {room.member_count} / {room.max_players}
        </span>
        {room.is_member ? (
          <Button asChild size="sm" type="button" variant="outline">
            <Link href={appRoutes.room(room.id)}>
              {roomContentRu.catalog.open}
            </Link>
          </Button>
        ) : (
          <Button onClick={() => onJoin(room)} size="sm" type="button">
            {roomContentRu.catalog.join}
          </Button>
        )}
      </CardContent>
    </Card>
  )
}
