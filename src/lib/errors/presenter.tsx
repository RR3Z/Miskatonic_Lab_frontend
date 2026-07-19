"use client"

import { toast } from "sonner"

import { getPresentedError } from "@/lib/errors/catalog"
import { resolveErrorCode } from "@/lib/errors/resolve-error-code"
import { appRoutes } from "@/lib/routes/app-routes"

function ErrorToastDescription({ code }: { code: string }) {
  const entry = getPresentedError(code)

  return (
    <div className="space-y-1">
      <p>{entry.toastSummary}</p>
      <a
        className="underline underline-offset-2"
        href={`${appRoutes.errors}#${encodeURIComponent(entry.code)}`}
      >
        Подробнее
      </a>
    </div>
  )
}

export async function showError(error: unknown, id?: string) {
  return showErrorCode(await resolveErrorCode(error), id)
}

export function showErrorCode(code: string, id?: string) {
  const entry = getPresentedError(code)
  return toast.error(`${entry.code} — ${entry.title}`, {
    description: <ErrorToastDescription code={entry.code} />,
    id,
  })
}
