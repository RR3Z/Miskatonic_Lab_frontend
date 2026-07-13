import { CaseFileCard } from "@/components/landing/case-file-card"
import { LandingBackground } from "@/components/landing/landing-background"
import { LandingMarquee } from "@/components/landing/landing-marquee"
import { MotionReveal } from "@/components/motion/motion-reveal"

export function LandingPage() {
  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <LandingBackground />
      <div className="relative z-10 flex min-h-0 flex-1 items-center px-3 py-2 sm:px-4 sm:py-6">
        <MotionReveal className="w-full" distance={14}>
          <CaseFileCard />
        </MotionReveal>
      </div>
      <LandingMarquee />
    </main>
  )
}
