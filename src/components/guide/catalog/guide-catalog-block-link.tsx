import Link from "next/link"

import { getGuideBlockHref } from "@/components/guide/utils/guide-route.util"
import type { GuideBlock } from "@/data/guide/types/guide-content.types"

type GuideCatalogBlockLinkProps = {
  block: GuideBlock
  onNavigate: () => void
  sectionSlug: string
}

export function GuideCatalogBlockLink({
  block,
  onNavigate,
  sectionSlug,
}: GuideCatalogBlockLinkProps) {
  return (
    <Link
      className="block w-full rounded-md px-2 py-1 text-xs leading-4 text-sidebar-foreground transition-[background-color,color] duration-150 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:bg-sidebar-accent focus-visible:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:outline-hidden"
      href={getGuideBlockHref(sectionSlug, block.id)}
      onClick={onNavigate}
    >
      <span className="whitespace-normal leading-4">{block.title}</span>
    </Link>
  )
}
