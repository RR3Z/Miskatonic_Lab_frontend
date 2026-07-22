import { z } from "zod"

const guideSymbolSchema = z.enum([
  "checks",
  "creation",
  "investigation",
  "combat",
  "chases",
  "sanity",
  "occult",
  "development",
])

const guideFlowDiagramSchema = z.object({
  ariaLabel: z.string().min(1),
  steps: z.array(
    z.object({
      detail: z.string().optional(),
      label: z.string().min(1),
    }),
  ),
  title: z.string().min(1),
})

const guideBlockSchema = z.object({
  body: z.string().min(1),
  bullets: z.array(z.string().min(1)).optional(),
  details: z.array(z.string().min(1)).optional(),
  diagram: guideFlowDiagramSchema.optional(),
  example: z
    .object({ outcome: z.string().min(1), title: z.string().min(1) })
    .optional(),
  formulas: z
    .array(
      z.object({
        description: z.string().min(1),
        expression: z.string().min(1),
        title: z.string().min(1),
      }),
    )
    .optional(),
  id: z.string().min(1),
  title: z.string().min(1),
})

export const guideContentSchema = z.object({
  sections: z.array(
    z.object({
      blocks: z.array(guideBlockSchema).min(1),
      description: z.string().min(1),
      slug: z.string().min(1),
      symbol: guideSymbolSchema,
      title: z.string().min(1),
    }),
  ),
  ui: z.object({
    article: z.object({
      examplePrefix: z.string().min(1),
      eyebrow: z.string().min(1),
    }),
    catalog: z.object({ label: z.string().min(1) }),
    index: z.object({
      description: z.string().min(1),
      eyebrow: z.string().min(1),
      openLabel: z.string().min(1),
      searchHint: z.string().min(1),
      title: z.string().min(1),
    }),
    search: z.object({
      ariaLabel: z.string().min(1),
      emptyMessage: z.string().min(1),
      placeholder: z.string().min(1),
      shortcutLabel: z.string().min(1),
    }),
  }),
})
