import {
  BookOpenText,
  CircleHelp,
  DoorOpen,
  House,
  UsersRound,
} from "lucide-react"

import type { NavigationItem } from "@/components/layout/types/navigation.types"
import localizedContent from "@/data/locales/ru/layout/layout.ru.json"
import { appRoutes } from "@/lib/routes/app-routes"

export const navigationItems: readonly NavigationItem[] = [
  {
    href: appRoutes.home,
    icon: House,
    kind: "link",
    label: localizedContent.copy.componentsLayoutSidebarNavigation.glavnaya,
  },
  {
    href: appRoutes.guide,
    icon: BookOpenText,
    kind: "link",
    label: localizedContent.copy.componentsLayoutSidebarNavigation.spravochnik,
  },
  {
    href: appRoutes.errors,
    icon: CircleHelp,
    kind: "link",
    label:
      localizedContent.copy.componentsLayoutSidebarNavigation.dokumentatsiya,
  },
  {
    href: appRoutes.characters,
    icon: UsersRound,
    kind: "auth",
    label:
      localizedContent.copy.componentsLayoutSidebarNavigation.spisokPersonazhei,
  },
  {
    href: appRoutes.rooms,
    icon: DoorOpen,
    kind: "auth",
    label: localizedContent.copy.componentsLayoutSidebarNavigation.komnatyWip,
  },
]
