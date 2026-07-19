import { Plus } from "lucide-react"

import { roomOutlineButtonClassName } from "@/components/room/styles/room-button.styles"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import roomContentRu from "@/data/room/room.ru.json"

export function RoomCatalogEmpty({ onCreate }: { onCreate: () => void }) {
  return (
    <Card className="border-dashed">
      <CardHeader>
        <CardTitle>{roomContentRu.catalog.emptyTitle}</CardTitle>
        <CardDescription>
          {roomContentRu.catalog.emptyDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          className={roomOutlineButtonClassName}
          onClick={onCreate}
          type="button"
          variant="outline"
        >
          <Plus aria-hidden="true" data-icon="inline-start" />
          {roomContentRu.catalog.create}
        </Button>
      </CardContent>
    </Card>
  )
}
