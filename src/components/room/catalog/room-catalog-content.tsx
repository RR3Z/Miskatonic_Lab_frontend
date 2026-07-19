import { RoomCatalogCard } from "@/components/room/catalog/room-catalog-card"
import { RoomCatalogEmpty } from "@/components/room/catalog/room-catalog-empty"
import { RoomCatalogError } from "@/components/room/catalog/room-catalog-error"
import { RoomCatalogLoading } from "@/components/room/catalog/room-catalog-loading"
import roomContentRu from "@/data/room/room.ru.json"
import type { RoomSummary } from "@/types/room"

type RoomCatalogContentProps = {
  hasLoadError: boolean
  isFetching: boolean
  isLoading: boolean
  onCreate: () => void
  onJoin: (room: RoomSummary) => void
  onRetry: () => void
  rooms: RoomSummary[]
}

export function RoomCatalogContent(props: RoomCatalogContentProps) {
  if (props.isLoading) return <RoomCatalogLoading />
  if (props.hasLoadError) {
    return (
      <RoomCatalogError isRetrying={props.isFetching} onRetry={props.onRetry} />
    )
  }
  if (props.rooms.length === 0)
    return <RoomCatalogEmpty onCreate={props.onCreate} />

  return (
    <section
      aria-busy={props.isFetching}
      aria-label={roomContentRu.catalog.catalogAriaLabel}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {props.rooms.map((room) => (
        <RoomCatalogCard key={room.id} onJoin={props.onJoin} room={room} />
      ))}
    </section>
  )
}
