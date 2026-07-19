import roomContentRu from "@/data/room/room.ru.json"

export function formatRoomCreatedAt(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return roomContentRu.catalog.unknownCreationDate
  }

  return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date)
}
