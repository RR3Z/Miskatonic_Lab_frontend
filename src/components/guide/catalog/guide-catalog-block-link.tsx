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
    <Link href={getGuideBlockHref(sectionSlug, block.id)} onClick={onNavigate}>
      <span className="whitespace-normal leading-4">{block.title}</span>
    </Link>
  )
}
