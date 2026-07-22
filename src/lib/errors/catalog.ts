import catalog from "@/data/locales/ru/errors/error-catalog.ru.json"
import { errorCatalogSchema } from "@/lib/errors/schemas/error-catalog.schema"

errorCatalogSchema.parse(catalog)

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
  action: string
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
  catalogCode: string
  isKnown: boolean
  action: string
  toastSummary: string
  documentation: Documentation
}

const errors = catalog.errors as Record<string, CatalogEntry>
const templates = catalog.templates as Record<string, Template>

export function getErrorCatalogLabels() {
  return catalog.labels
}

export const UNKNOWN_ERROR_CODE = "client.unknown_error"

export function getPresentedError(code: string): PresentedError {
  const isKnown = hasErrorCode(code)
  const catalogCode = isKnown ? code : UNKNOWN_ERROR_CODE
  const entry = errors[catalogCode]
  const template = templates[entry.template]

  return {
    ...entry,
    action: template.action,
    catalogCode,
    code,
    isKnown,
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
