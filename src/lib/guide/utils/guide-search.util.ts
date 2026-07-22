import { guideContent } from "@/lib/guide/guide-content"
import type {
  GuideSearchResult,
  GuideSection,
} from "@/types/guide-content.types"

export function getGuideSection(slug: string): GuideSection | undefined {
  return guideContent.sections.find((section) => section.slug === slug)
}

export function getGuideSearchResults(query: string): GuideSearchResult[] {
  const normalizedQuery = query.trim().toLocaleLowerCase("ru")

  if (!normalizedQuery) {
    return []
  }

  return guideContent.sections.flatMap((section) =>
    section.blocks.flatMap((block) => {
      const searchableText = [
        section.title,
        section.description,
        block.title,
        block.body,
        ...(block.details ?? []),
        ...(block.bullets ?? []),
        block.example?.title ?? "",
        block.example?.outcome ?? "",
        ...(block.formulas?.flatMap((formula) => [
          formula.title,
          formula.expression,
          formula.description,
        ]) ?? []),
        block.diagram?.title ?? "",
        ...(block.diagram?.steps.map(
          (step) => `${step.label} ${step.detail ?? ""}`,
        ) ?? []),
      ]
        .join(" ")
        .toLocaleLowerCase("ru")

      return searchableText.includes(normalizedQuery)
        ? [
            {
              blockId: block.id,
              excerpt: block.body,
              sectionSlug: section.slug,
              sectionTitle: section.title,
              title: block.title,
            },
          ]
        : []
    }),
  )
}
