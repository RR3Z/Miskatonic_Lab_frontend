import { z } from "zod"

const documentationCaseSchema = z.object({
  situation: z.string().min(1),
  why: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
})

const documentationSchema = z.object({
  summary: z.string().min(1),
  cases: z.array(documentationCaseSchema).min(1),
  supportHint: z.string().min(1),
})

export const errorCatalogSchema = z
  .object({
    version: z.literal(1),
    labels: z.record(z.string(), z.string().min(1)),
    templates: z.record(
      z.string(),
      z.object({
        action: z.string().min(1),
        toastSummary: z.string().min(1),
        documentation: documentationSchema,
      }),
    ),
    errors: z.record(
      z.string(),
      z.object({
        kind: z.enum(["api", "client"]),
        template: z.string().min(1),
        title: z.string().min(1),
      }),
    ),
  })
  .superRefine((catalog, context) => {
    for (const [code, entry] of Object.entries(catalog.errors)) {
      if (!(entry.template in catalog.templates)) {
        context.addIssue({
          code: "custom",
          message: `${code}: unknown template ${entry.template}`,
          path: ["errors", code, "template"],
        })
      }
    }
  })
