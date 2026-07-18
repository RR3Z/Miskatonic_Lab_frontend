import { GuideArticleBlock } from "@/components/guide/article/guide-article-block"
import { GuideArticleHeader } from "@/components/guide/article/guide-article-header"
import type { GuideSection } from "@/data/guide/types/guide-content.types"

type GuideArticlePageProps = {
  matchedBlockId?: string
  section: GuideSection
}

export function GuideArticlePage({
  matchedBlockId,
  section,
}: GuideArticlePageProps) {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
      <GuideArticleHeader section={section} />
      <div className="mt-6 space-y-5">
        {section.blocks.map((block) => (
          <GuideArticleBlock
            block={block}
            isMatched={matchedBlockId === block.id}
            key={block.id}
          />
        ))}
      </div>
    </main>
  )
}
