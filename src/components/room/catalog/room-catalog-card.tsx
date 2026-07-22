import { DoorOpen } from "lucide-react"
import Link from "next/link"
import { roomOutlineButtonClassName } from "@/components/room/styles/room-button.styles"
import { formatRoomCreatedAt } from "@/components/room/utils/format-room-created-at.util"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card/card"
import { CardContent } from "@/components/ui/card/card-content"
import { CardDescription } from "@/components/ui/card/card-description"
import { CardHeader } from "@/components/ui/card/card-header"
import { CardTitle } from "@/components/ui/card/card-title"
import roomContentRu from "@/data/locales/ru/room/catalog.ru.json"
import { appRoutes } from "@/lib/routes/app-routes"
import type { RoomSummary } from "@/types/room.types"

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
          <Button
            asChild
            className={roomOutlineButtonClassName}
            size="sm"
            type="button"
            variant="outline"
          >
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
