import { SocialLinks } from "@/components/social/social-links"
import { landingContent } from "@/lib/content/landing.content"
import githubIcon from "../../../assets/icons/github.svg"
import telegramIcon from "../../../assets/icons/telegram.svg"

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

export function SiteFooter() {
  return (
    <footer className="relative z-10 hidden flex-col items-center gap-2 border-t border-[var(--ml-border-aged)] px-8 py-2.5 text-[var(--ml-ink-muted)] sm:flex min-[968px]:flex-row min-[968px]:justify-between min-[968px]:gap-4">
      <div className="mx-auto text-center font-body text-[0.62rem] uppercase tracking-[0.08em]">
        <p>{footer.copyright}</p>
        <p className="mt-1">{footer.notice}</p>
      </div>
      <div className="flex items-center justify-center gap-3 min-[968px]:absolute min-[968px]:right-8 min-[968px]:bottom-4">
        <SocialLinks
          iconClassName="ml-footer-icon size-7 opacity-85 transition group-hover:opacity-100"
          links={socialLinks}
        />
      </div>
    </footer>
  )
}

export function MobileSiteFooter() {
  return (
    <footer className="mt-4 border-t border-[var(--ml-border-aged)] pt-4 text-[var(--ml-ink-muted)] sm:hidden">
      <p className="text-center font-body text-[0.62rem] uppercase tracking-[0.08em]">
        {footer.copyright}
      </p>
      <div className="mt-3 flex items-center justify-center gap-4">
        <SocialLinks
          iconClassName="ml-footer-icon size-7 opacity-85 transition group-hover:opacity-100"
          links={socialLinks}
        />
      </div>
    </footer>
  )
}
