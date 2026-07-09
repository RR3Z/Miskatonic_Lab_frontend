import { CharacterListPage } from "@/components/character/character-list-page"
import { LandingBackground } from "@/components/landing/landing-background"
import { SiteFooter } from "@/components/layout/site-footer"
import { SiteHeader } from "@/components/layout/site-header"

export default function CharactersPage() {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <div className="fixed inset-0">
        <LandingBackground />
      </div>
      <SiteHeader />
      <main className="relative z-10 flex-1">
        <CharacterListPage />
      </main>
      <SiteFooter />
    </div>
  )
}
