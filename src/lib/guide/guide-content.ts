import guideRussianContent from "@/data/locales/ru/guide/content.ru.json"
import { guideContentSchema } from "@/lib/guide/schemas/guide-content.schema"

export const guideContent = guideContentSchema.parse(guideRussianContent)
