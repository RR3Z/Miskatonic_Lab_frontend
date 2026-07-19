import { Skeleton } from "@/components/ui/skeleton"
import roomContentRu from "@/data/room/room.ru.json"

export function RoomCatalogLoading() {
  return (
    <section
      aria-busy
      aria-label={roomContentRu.catalog.loadingAriaLabel}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
    >
      {["one", "two", "three", "four", "five", "six"].map((key) => (
        <Skeleton className="h-40 rounded-xl" key={key} />
      ))}
    </section>
  )
}
