export type GuideSymbolName =
  | "checks"
  | "creation"
  | "investigation"
  | "combat"
  | "chases"
  | "sanity"
  | "occult"
  | "development"

export type GuideFlowStep = {
  detail?: string
  label: string
}

export type GuideFlowDiagram = {
  ariaLabel: string
  steps: GuideFlowStep[]
  title: string
}

export type GuideFormula = {
  description: string
  expression: string
  title: string
}

export type GuideExample = {
  outcome: string
  title: string
}

export type GuideBlock = {
  body: string
  bullets?: string[]
  details?: string[]
  diagram?: GuideFlowDiagram
  example?: GuideExample
  formulas?: GuideFormula[]
  id: string
  title: string
}

export type GuideSection = {
  blocks: GuideBlock[]
  description: string
  slug: string
  symbol: GuideSymbolName
  title: string
}

export type GuideUiCopy = {
  article: {
    examplePrefix: string
    eyebrow: string
  }
  catalog: {
    label: string
  }
  index: {
    description: string
    eyebrow: string
    openLabel: string
    searchHint: string
    title: string
  }
  search: {
    ariaLabel: string
    emptyMessage: string
    placeholder: string
    shortcutLabel: string
  }
}

export type GuideContent = {
  sections: GuideSection[]
  ui: GuideUiCopy
}

export type GuideSearchResult = {
  blockId: string
  excerpt: string
  sectionSlug: string
  sectionTitle: string
  title: string
}
