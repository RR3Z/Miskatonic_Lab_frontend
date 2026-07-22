import { CircleAlert } from "lucide-react"
import { Alert } from "@/components/ui/alert/alert"
import { AlertAction } from "@/components/ui/alert/alert-action"
import { AlertDescription } from "@/components/ui/alert/alert-description"
import { AlertTitle } from "@/components/ui/alert/alert-title"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import localizedContent from "@/data/locales/ru/character/list.ru.json"

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
        {
          localizedContent.copy.componentsCharacterListCharacterListError
            .neUdalosZagruzitPersonazhei
        }
      </AlertTitle>
      <AlertDescription>
        {
          localizedContent.copy.componentsCharacterListCharacterListError
            .provertePodklyuchenieIPoprobuitePoluchitSpisok
        }
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
          {isFetching
            ? localizedContent.copy.componentsCharacterListCharacterListError
                .zagruzka
            : localizedContent.copy.componentsCharacterListCharacterListError
                .povtorit}
        </Button>
      </AlertAction>
    </Alert>
  )
}
