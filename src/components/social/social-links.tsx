import Image, { type StaticImageData } from "next/image";

type SocialLink = {
  href: string;
  icon: StaticImageData;
  label: string;
};

type SocialLinksProps = {
  iconClassName?: string;
  links: readonly SocialLink[];
};

export function SocialLinks({ iconClassName, links }: SocialLinksProps) {
  return (
    <>
      {links.map((link) => (
        <a
          aria-label={link.label}
          className="group text-[var(--ml-ink-muted)] transition hover:text-[var(--ml-accent-brass)]"
          href={link.href}
          key={link.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt=""
            aria-hidden="true"
            className={iconClassName}
            height={36}
            src={link.icon}
            width={36}
          />
        </a>
      ))}
    </>
  );
}
