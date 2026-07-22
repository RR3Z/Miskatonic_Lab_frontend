import { CircleAlert } from "lucide-react"
import Link from "next/link"
import { Alert } from "@/components/ui/alert/alert"
import { AlertAction } from "@/components/ui/alert/alert-action"
import { AlertDescription } from "@/components/ui/alert/alert-description"
import { AlertTitle } from "@/components/ui/alert/alert-title"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
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
            ? localizedContent.copy
                .componentsCharacterDetailCharacterDetailError.personazhNeNaiden
            : localizedContent.copy
                .componentsCharacterDetailCharacterDetailError
                .neUdalosZagruzitListPersonazha}
        </AlertTitle>
        <AlertDescription>
          {notFound
            ? localizedContent.copy
                .componentsCharacterDetailCharacterDetailError
                .vozmozhnoPersonazhBylUdalenIliNedostupen
            : localizedContent.copy
                .componentsCharacterDetailCharacterDetailError
                .provertePodklyuchenieIPoprobuitePoluchitDannye}
        </AlertDescription>
        <AlertAction className="gap-2">
          {notFound ? (
            <Button asChild size="sm" variant="secondary">
              <Link href={appRoutes.characters}>
                {
                  localizedContent.copy
                    .componentsCharacterDetailCharacterDetailError
                    .kSpiskuPersonazhei
                }
              </Link>
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
              {isFetching
                ? localizedContent.copy
                    .componentsCharacterDetailCharacterDetailError.zagruzka
                : localizedContent.copy
                    .componentsCharacterDetailCharacterDetailError.povtorit}
            </Button>
          )}
        </AlertAction>
      </Alert>
    </div>
  )
}
