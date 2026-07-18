import { SocialLinks } from "@/components/social/social-links"
import { landingContent } from "@/lib/content/landing.content"
import { cn } from "@/lib/utils/cn.util"
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

type SidebarSiteFooterProps = {
  fullWidth?: boolean
}

export function SidebarSiteFooter({
  fullWidth = false,
}: SidebarSiteFooterProps) {
  return (
    <footer
      className={cn(
        "mt-1 border-t border-[var(--ml-border-aged)] pt-3 text-[var(--ml-ink-muted)] group-data-[collapsible=icon]:hidden",
        fullWidth && "-mx-2",
      )}
    >
      <p className="text-center font-body text-[0.62rem] uppercase tracking-[0.08em]">
        {footer.copyright}
      </p>
      <p className="mt-1 text-center font-body text-[0.52rem] leading-relaxed uppercase tracking-[0.06em]">
        {footer.notice}
      </p>
      <div className="mt-3 flex items-center justify-center gap-3">
        <SocialLinks
          iconClassName="ml-footer-icon size-6 opacity-85 transition group-hover:opacity-100"
          links={socialLinks}
        />
      </div>
    </footer>
  )
}
