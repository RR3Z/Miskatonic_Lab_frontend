import { FileSearch } from "lucide-react"

import { guideContent } from "@/lib/guide/guide-content"

export function GuideSearchEmptyState() {
  return (
    <div className="flex min-h-28 flex-col items-center justify-center px-5 text-center text-(--ml-ink-muted)">
      <FileSearch aria-hidden="true" size={22} />
      <p className="mt-2 text-sm leading-5">
        {guideContent.ui.search.emptyMessage}
      </p>
    </div>
  )
}
