import { getErrorCatalogLabels, getPresentedError } from "@/lib/errors/catalog"
import { appRoutes } from "@/lib/routes/app-routes"

type ErrorToastDescriptionProps = {
  code: string
}

export function ErrorToastDescription({ code }: ErrorToastDescriptionProps) {
  const entry = getPresentedError(code)

  return (
    <div className="space-y-1">
      <p>{entry.toastSummary}</p>
      <p>{entry.action}</p>
      <a
        className="underline underline-offset-2"
        href={appRoutes.error(entry.code)}
      >
        {getErrorCatalogLabels().details}
      </a>
    </div>
  )
}
