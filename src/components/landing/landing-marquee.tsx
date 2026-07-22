import { InfiniteMarquee } from "@/components/marquee/infinite-marquee"
import { landingContent } from "@/data/locales/utils/landing-content.util"

const marqueeDurationSeconds = 26

export function LandingMarquee() {
  return (
    <InfiniteMarquee
      aria-label={landingContent.marquee.ariaLabel}
      className="relative z-10 mb-[clamp(1rem,4vh,3rem)] w-full border-[color-mix(in_srgb,var(--ml-border-subtle)_52%,transparent)] border-y bg-[rgba(16,14,12,0.34)] py-1.5 sm:py-3"
      durationSeconds={marqueeDurationSeconds}
      items={landingContent.marquee.items}
      separator={
        <span aria-hidden="true" className="text-(--ml-accent-brass)">
          ·
        </span>
      }
      trackClassName="font-heading text-[1.22rem] text-[var(--ml-ink-primary)] leading-none sm:text-[2.45rem]"
    />
  )
}
