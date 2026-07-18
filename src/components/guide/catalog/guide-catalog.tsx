import { GuideCatalogSection } from "@/components/guide/catalog/guide-catalog-section"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar"
import { guideContent } from "@/data/guide/guide-content.data"

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
