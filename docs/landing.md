# Landing Architecture

Landing page lives in `src/components/landing` and keeps page-specific layout there. Shared pieces live outside that folder:

- `src/components/auth/auth-gate-action.tsx`: Clerk-aware action that opens sign-in modal for signed-out users and renders a link for signed-in users.
- `src/components/auth/header-auth.tsx`: Clerk-aware header sign-in/user menu control.
- `src/components/brand/brand-mark.tsx`: reusable Miskatonic Lab mark.
- `src/components/marquee/infinite-marquee.tsx`: reusable Motion-based infinite marquee without Motion+.
- `src/components/social/social-links.tsx`: reusable external social link icons.
- `src/components/ui/button.tsx`: shared button variants.

Landing copy and URLs stay data-driven:

- `src/lib/content/landing.content.ts`: all visible landing text, footer links, case-file copy.
- `src/lib/routes/app-routes.ts`: app route constants such as `/characters` and `/characters/new`.

Theme values live in `src/app/globals.css` under `theme-dark` and `theme-light`. Use `--ml-*` semantic tokens for Miskatonic-specific surfaces, inks, borders, and accents instead of generic names such as `--text`.
