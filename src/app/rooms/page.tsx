import { LandingBackground } from "@/components/landing/landing-background"
import { RoomCatalogPage } from "@/components/room/catalog/room-catalog-page"

export default function RoomsPage() {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <div className="fixed inset-0">
        <LandingBackground />
      </div>
      <main className="relative z-10 flex-1">
        <RoomCatalogPage />
      </main>
    </div>
  )
}
