import Link from "next/link"

import { GuideCatalogBlockLink } from "@/components/guide/catalog/guide-catalog-block-link"
import { SidebarMenuButton } from "@/components/ui/sidebar/sidebar-menu-button"
import { SidebarMenuItem } from "@/components/ui/sidebar/sidebar-menu-item"
import { SidebarMenuSub } from "@/components/ui/sidebar/sidebar-menu-sub"
import { SidebarMenuSubItem } from "@/components/ui/sidebar/sidebar-menu-sub-item"
import { appRoutes } from "@/lib/routes/app-routes"
import type { GuideSection } from "@/types/guide-content.types"

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
      <SidebarMenuSub className="mt-0.5 ml-3 mr-0 w-[calc(100%-0.75rem)]">
        {section.blocks.map((block) => (
          <SidebarMenuSubItem key={block.id}>
            <GuideCatalogBlockLink
              block={block}
              onNavigate={onNavigate}
              sectionSlug={section.slug}
            />
          </SidebarMenuSubItem>
        ))}
      </SidebarMenuSub>
    </SidebarMenuItem>
  )
}
