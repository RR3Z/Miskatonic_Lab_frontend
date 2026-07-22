import type { LucideIcon } from "lucide-react"

type NavigationItemBase = {
  icon: LucideIcon
  label: string
}

export type NavigationItem =
  | (NavigationItemBase & {
      href: string
      kind: "link"
    })
  | (NavigationItemBase & {
      href: string
      kind: "auth"
    })
