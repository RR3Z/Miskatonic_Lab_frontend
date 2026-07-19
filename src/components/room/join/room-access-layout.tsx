import { LandingBackground } from "@/components/landing/landing-background"

type RoomAccessLayoutProps = {
  children: React.ReactNode
}

export function RoomAccessLayout({ children }: RoomAccessLayoutProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col overflow-x-hidden bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <div className="fixed inset-0">
        <LandingBackground />
      </div>
      <main className="relative z-10 mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-10 sm:px-8">
        {children}
      </main>
    </div>
  )
}
