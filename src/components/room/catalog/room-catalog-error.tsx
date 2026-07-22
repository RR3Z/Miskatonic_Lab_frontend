import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card/card"
import { CardContent } from "@/components/ui/card/card-content"
import { CardDescription } from "@/components/ui/card/card-description"
import { CardHeader } from "@/components/ui/card/card-header"
import { CardTitle } from "@/components/ui/card/card-title"
import roomContentRu from "@/data/locales/ru/room/catalog.ru.json"

type RoomCatalogErrorProps = {
  isRetrying: boolean
  onRetry: () => void
}

export function RoomCatalogError({
  isRetrying,
  onRetry,
}: RoomCatalogErrorProps) {
  return (
    <Card className="border-destructive/70 bg-destructive/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <CircleAlert aria-hidden="true" />
          {roomContentRu.catalog.loadErrorTitle}
        </CardTitle>
        <CardDescription>
          {roomContentRu.catalog.loadErrorDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={isRetrying}
          onClick={onRetry}
          type="button"
          variant="secondary"
        >
          {roomContentRu.catalog.retry}
        </Button>
      </CardContent>
    </Card>
  )
}
