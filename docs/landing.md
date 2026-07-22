# Landing Architecture

Landing page lives in `src/components/landing` and keeps page-specific layout there. Shared pieces live outside that folder:

- `src/components/auth/auth-gate-action.tsx`: Clerk-aware action that opens sign-in modal for signed-out users and renders a link for signed-in users.
- `src/components/brand/brand-mark.tsx`: reusable Miskatonic Lab mark.
- `src/components/layout/app-sidebar.tsx`: shared responsive navigation and auth controls.
- `src/components/marquee/infinite-marquee.tsx`: reusable Motion-based infinite marquee without Motion+.
- `src/components/motion/motion-reveal.tsx`: reduced-motion-aware entrance for the case file.
- `src/components/social/social-links.tsx`: reusable external social link icons.
- `src/components/ui/button.tsx`: shared button variants.

Landing copy and URLs stay data-driven:

- `src/lib/content/landing.content.ts`: all visible landing text, footer links, case-file copy.
- `src/lib/routes/app-routes.ts`: app route constants such as `/` and `/characters`.

Theme values live in `src/app/globals.css` under `theme-dark` and `theme-light`. Use `--ml-*` semantic tokens for Miskatonic-specific surfaces, inks, borders, and accents instead of generic names such as `--text`.
