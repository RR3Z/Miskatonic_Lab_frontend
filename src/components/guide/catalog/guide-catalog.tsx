import { GuideCatalogSection } from "@/components/guide/catalog/guide-catalog-section"
import { SidebarGroup } from "@/components/ui/sidebar/sidebar-group"
import { SidebarGroupContent } from "@/components/ui/sidebar/sidebar-group-content"
import { SidebarGroupLabel } from "@/components/ui/sidebar/sidebar-group-label"
import { SidebarMenu } from "@/components/ui/sidebar/sidebar-menu"
import { guideContent } from "@/lib/guide/guide-content"

type GuideCatalogProps = {
  onNavigate: () => void
}

export function GuideCatalog({ onNavigate }: GuideCatalogProps) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{guideContent.ui.catalog.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {guideContent.sections.map((section) => (
            <GuideCatalogSection
              key={section.slug}
              onNavigate={onNavigate}
              section={section}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
