import { GuideIndexHeader } from "@/components/guide/index/guide-index-header"
import { GuideSectionCard } from "@/components/guide/index/guide-section-card"
import { guideContent } from "@/lib/guide/guide-content"

export function GuideIndexPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
        <GuideIndexHeader />
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {guideContent.sections.map((section) => (
            <GuideSectionCard key={section.slug} section={section} />
          ))}
        </div>
      </div>
    </main>
  )
}
