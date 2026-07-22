import landingRussianContent from "@/data/locales/ru/landing/content.ru.json"
import { appRoutes } from "@/lib/routes/app-routes"

export const landingContent = {
  ...landingRussianContent,
  caseFile: {
    ...landingRussianContent.caseFile,
    actions: {
      openArchive: {
        ...landingRussianContent.caseFile.actions.openArchive,
        href: appRoutes.characters,
      },
      createInvestigator: {
        ...landingRussianContent.caseFile.actions.createInvestigator,
        href: appRoutes.newCharacter,
      },
    },
  },
} as const
