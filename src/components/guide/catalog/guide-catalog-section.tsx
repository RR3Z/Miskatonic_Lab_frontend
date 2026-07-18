import Link from "next/link"

import { GuideCatalogBlockLink } from "@/components/guide/catalog/guide-catalog-block-link"
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import type { GuideSection } from "@/data/guide/types/guide-content.types"
import { appRoutes } from "@/lib/routes/app-routes"

type GuideCatalogSectionProps = {
  onNavigate: () => void
  section: GuideSection
}

export function GuideCatalogSection({
  onNavigate,
  section,
}: GuideCatalogSectionProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        className="h-auto min-h-8 px-2 py-1.5 text-sm font-semibold leading-5 [&>span:last-child]:!overflow-visible [&>span:last-child]:!text-clip [&>span:last-child]:!whitespace-normal"
      >
        <Link href={appRoutes.guideSection(section.slug)} onClick={onNavigate}>
          <span>{section.title}</span>
        </Link>
      </SidebarMenuButton>
      <SidebarMenuSub className="mt-0.5 w-auto">
        {section.blocks.map((block) => (
          <SidebarMenuSubItem key={block.id}>
            <SidebarMenuSubButton
              asChild
              className="h-auto min-h-7 w-full px-2 py-1 text-xs leading-4 transition-[background-color,color] duration-150 [&>span:last-child]:!overflow-visible [&>span:last-child]:!text-clip [&>span:last-child]:!whitespace-normal"
            >
              <GuideCatalogBlockLink
                block={block}
                onNavigate={onNavigate}
                sectionSlug={section.slug}
              />
            </SidebarMenuSubButton>
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  )
}
