import { CircleAlert } from "lucide-react"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

type CharacterListErrorProps = {
  isFetching: boolean
  onRetry: () => void
}

export function CharacterListError({
  isFetching,
  onRetry,
}: CharacterListErrorProps) {
  return (
    <Alert
      className="col-span-full border-destructive/70 bg-destructive/10"
      variant="destructive"
    >
      <CircleAlert aria-hidden="true" />
      <AlertTitle className="text-destructive">
        Не удалось загрузить персонажей
      </AlertTitle>
      <AlertDescription>
        Проверьте подключение и попробуйте получить список ещё раз.
      </AlertDescription>
      <AlertAction>
        <Button
          disabled={isFetching}
          onClick={onRetry}
          size="sm"
          type="button"
          variant="secondary"
        >
          {isFetching ? (
            <Spinner aria-hidden="true" data-icon="inline-start" />
          ) : null}
          {isFetching ? "Загрузка…" : "Повторить"}
        </Button>
      </AlertAction>
    </Alert>
  )
}
