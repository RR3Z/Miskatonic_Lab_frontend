import catalog from "@/data/errors/error-catalog.ru.json"

type DocumentationCase = {
  situation: string
  why: string
  steps: string[]
}

type Documentation = {
  summary: string
  cases: DocumentationCase[]
  supportHint: string
}

type Template = {
  toastSummary: string
  documentation: Documentation
}

type CatalogEntry = {
  kind: "api" | "client"
  template: keyof typeof catalog.templates
  title: string
}

export type PresentedError = CatalogEntry & {
  code: string
  toastSummary: string
  documentation: Documentation
}

const errors = catalog.errors as Record<string, CatalogEntry>
const templates = catalog.templates as Record<string, Template>

export const UNKNOWN_ERROR_CODE = "client.unknown_error"

export function getPresentedError(code: string): PresentedError {
  const entry = errors[code] ?? errors[UNKNOWN_ERROR_CODE]
  const template = templates[entry.template]

  return {
    ...entry,
    code: errors[code] ? code : UNKNOWN_ERROR_CODE,
    toastSummary: template.toastSummary,
    documentation: template.documentation,
  }
}

export function hasErrorCode(code: string) {
  return code in errors
}

export function getAllErrorCodes() {
  return Object.keys(errors)
}
