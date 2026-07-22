import { notFound } from "next/navigation"

import { GuideArticlePage } from "@/components/guide/article/guide-article-page"
import { getGuideSection } from "@/lib/guide/utils/guide-search.util"

type GuideArticleRouteProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ match?: string }>
}

export const dynamic = "force-dynamic"

export default async function GuideArticleRoute({
  params,
  searchParams,
}: GuideArticleRouteProps) {
  const [{ slug }, { match }] = await Promise.all([params, searchParams])
  const section = getGuideSection(slug)

  if (!section) notFound()

  return (
    <div className="flex min-h-full flex-1 flex-col overflow-x-hidden bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <GuideArticlePage matchedBlockId={match} section={section} />
    </div>
  )
}
