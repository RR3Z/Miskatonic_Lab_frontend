"use client"

import { GuideSearch } from "@/components/guide/search/guide-search"
import { SidebarTrigger } from "@/components/ui/sidebar/sidebar-trigger"
import localizedContent from "@/data/locales/ru/guide/content.ru.json"

export function GuideLayoutToolbar() {
  return (
    <div className="sticky top-0 z-30 flex h-14 items-center justify-center border-b border-(--ml-border-subtle) bg-(--ml-bg-page)/95 px-3 backdrop-blur sm:px-5">
      <SidebarTrigger
        aria-label={
          localizedContent.copy.componentsGuideSearchGuideLayoutToolbar
            .otkrytKatalog
        }
        className="absolute left-3 shrink-0 border border-(--ml-border-subtle) bg-(--ml-surface-panel) text-(--ml-ink-primary) hover:bg-(--ml-surface-panel-raised) md:hidden"
        size="icon-sm"
      />
      <GuideSearch />
    </div>
  )
}
