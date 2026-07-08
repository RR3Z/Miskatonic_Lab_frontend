import { SocialLinks } from "@/components/social/social-links"
import { landingContent } from "@/lib/content/landing.content"
import githubIcon from "../../../assets/icons/github.svg"
import telegramIcon from "../../../assets/icons/telegram.svg"

export function LandingFooter() {
  const { footer } = landingContent
  const socialLinks = [
    {
      href: footer.links.telegram.href,
      icon: telegramIcon,
      label: `${footer.links.telegram.label} ${footer.links.telegram.handle}`,
    },
    {
      href: footer.links.github.href,
      icon: githubIcon,
      label: `${footer.links.github.label} ${footer.links.github.handle}`,
    },
  ] as const

  return (
    <footer className="relative z-10 flex flex-col items-center justify-between gap-1.5 px-4 py-2 text-[var(--ml-ink-muted)] sm:flex-row sm:gap-4 sm:px-8 sm:py-4">
      <div className="mx-auto text-center font-body text-[0.46rem] uppercase tracking-[0.08em] sm:text-[0.62rem]">
        <p>{footer.copyright}</p>
        <p className="mt-1">{footer.notice}</p>
      </div>
      <div className="flex items-center gap-3 sm:absolute sm:right-8 sm:bottom-4">
        <SocialLinks
          iconClassName="ml-footer-icon size-4 opacity-85 transition group-hover:opacity-100 sm:size-7"
          links={socialLinks}
        />
      </div>
    </footer>
  )
}
