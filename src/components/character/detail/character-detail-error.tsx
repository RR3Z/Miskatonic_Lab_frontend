import { CircleAlert } from "lucide-react"
import Link from "next/link"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { appRoutes } from "@/lib/routes/app-routes"

type CharacterDetailErrorProps = {
  isFetching: boolean
  notFound?: boolean
  onRetry: () => void
}

export function CharacterDetailError({
  isFetching,
  notFound = false,
  onRetry,
}: CharacterDetailErrorProps) {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center px-8 py-10">
      <Alert
        className="border-destructive/70 bg-destructive/10"
        variant="destructive"
      >
        <CircleAlert aria-hidden="true" />
        <AlertTitle className="text-destructive">
          {notFound
            ? "Персонаж не найден"
            : "Не удалось загрузить лист персонажа"}
        </AlertTitle>
        <AlertDescription>
          {notFound
            ? "Возможно, персонаж был удалён или недоступен текущему пользователю."
            : "Проверьте подключение и попробуйте получить данные ещё раз."}
        </AlertDescription>
        <AlertAction className="gap-2">
          {notFound ? (
            <Button asChild size="sm" variant="secondary">
              <Link href={appRoutes.characters}>К списку персонажей</Link>
            </Button>
          ) : (
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
          )}
        </AlertAction>
      </Alert>
    </div>
  )
}
