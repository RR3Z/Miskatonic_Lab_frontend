import { appRoutes } from "@/lib/routes/app-routes"

export function getGuideBlockHref(sectionSlug: string, blockId: string) {
  return `${appRoutes.guideSection(sectionSlug)}#${blockId}`
}

export function getGuideSearchResultHref(
  result: { blockId: string; sectionSlug: string },
  query: string,
) {
  const search = new URLSearchParams({
    match: result.blockId,
    q: query,
  })

  return `${appRoutes.guideSection(result.sectionSlug)}?${search.toString()}#${result.blockId}`
}
