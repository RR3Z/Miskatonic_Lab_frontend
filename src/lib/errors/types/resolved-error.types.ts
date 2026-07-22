export type ErrorSource = "backend" | "client" | "network"

export type ResolvedError = {
  rawCode: string
  catalogCode: string
  isKnown: boolean
  source: ErrorSource
}
