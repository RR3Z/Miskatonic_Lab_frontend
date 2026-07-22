# Frontend Architecture

This document describes the current boundaries of the frontend. It is a map of implemented code, not a future folder scaffold.

## Ownership boundaries

| Area | Owns | Does not own |
| --- | --- | --- |
| `src/app` | Routes, server layouts, route-level auth redirects, provider composition | Feature forms and API workflows |
| `src/components/<feature>` | Feature UI and interaction composition | Generic UI primitives and transport details |
| `src/components/ui` | Shared shadcn/ui primitives and project styling variants | Character- or route-specific behavior |
| `src/data/<feature>` | Localized static feature data and its types | Components and search behavior |
| `src/hooks/<feature>` | Reusable feature interaction hooks | Route markup and static content |
| `src/dto/<feature>` | Zod validation, normalization, input and validated DTO types | Network requests and visual state |
| `src/lib/api` | API client, transport functions, TanStack Query hooks, query keys and cache lifecycle | Form markup and route redirects |
| `src/lib/clerk` | Shared Clerk server configuration and appearance | Feature authorization rules |
| `src/types` | Backend response and normalized domain-facing shapes | Validation schemas and component props that are local to one file |

Complex feature flows may add a subfolder. Character creation lives under `src/components/character/create` so the list page composes the flow without owning its form fields, portrait state, or submission UI.

## Protected route flow

`/characters` uses a server-owned auth boundary:

1. `src/proxy.ts` initializes Clerk middleware when real Clerk keys are configured.
2. `src/app/characters/layout.tsx` performs the effective route guard.
3. Missing Clerk configuration redirects to `/` instead of rendering a broken protected screen.
4. A signed-out request redirects to `/?sign-in=characters`.
5. `SignInIntent` consumes that intent, opens the existing Clerk modal, and uses `/characters` as `forceRedirectUrl`.

Client controls may improve the signed-out experience, but they are not authorization boundaries. Protected pages must keep their server layout guard.

## Character server state

TanStack Query cache ownership follows the authenticated Clerk user:

- `characterQueryKeys.list(userId)` is the only key for a loaded character list.
- Character queries stay disabled until Clerk is loaded and a `userId` exists.
- Create and delete mutations reject when no authenticated user exists.
- Mutations invalidate only the current user's list key.
- `AuthQueryCacheBoundary` removes the exact previous-user list when the session changes or signs out.

Never add a user-owned response under a user-agnostic query key. New authenticated resources should use the same key factory and session-bound cleanup pattern.

## Character creation composition

The creation flow is split by responsibility:

- `create-character-card.tsx`: entry control.
- `create-character-modal.tsx`: dialog lifecycle and pending-close guard.
- `create-character-form.tsx`: form orchestration, mutation result and toast mapping.
- `character-identity-fields.tsx`: identity controls.
- `character-portrait-field.tsx`: file validation, preview and selection state.
- `create-character.dto.ts`: validation and conversion from raw fields to API-ready values.
- `characters.ts`: create request followed by optional portrait upload.
- `use-characters.ts`: authenticated mutation and scoped cache invalidation.

Character creation may succeed while portrait upload fails. The API workflow returns `portraitStatus` so the UI can close the successful creation flow and show a warning instead of treating the whole operation as failed. Ky HTTP errors expose parsed backend bodies through `HTTPError.data`; error-code mapping must read that parsed data.

The current query-string creation intent is documented as planned cleanup in [future-plans.md](future-plans.md).

## Character sheet composition

Character detail code is grouped by UI ownership under `src/components/character/detail`:

- `header` owns identity, characteristics, derived stats, resources, and condition presentation.
- `layout` owns resizable panel composition and per-Character layout persistence.
- `skills` owns grouping, sorting, and skill-row presentation.
- `tabs` owns tab navigation plus fixed history sections, finances, notes, inventory, and weapons surfaces.
- `notes` owns the inline note draft, editable note cards, validation wiring, and note mutation lifecycle.
- `editors` owns reusable inline text editing and destructive-action confirmation UI.
- Domain API modules and TanStack mutations are split into notes, backstory, and finances files under `src/lib/api`; shared authenticated cache access lives in `use-character-mutation-context.ts`.

Notes expose editable titles and bodies. Backstory and finance labels remain fixed while their values are edited in place. TanStack Query remains the owner of server state; short-lived draft and editor state stays local, so this flow does not require Redux or a Zustand store.

The sheet header follows the same boundary: profile, characteristics, derived statistics, resources, portrait replacement, and condition toggles write through domain-specific TanStack mutations. Condition controls update optimistically and restore their previous value when the request fails. Characteristic writes send the complete backend payload; partial resource writes send only the changed field. Skill deletion is supported, while skill creation and update wait for category and specialty identifiers from the backend contract.

Each React component has one implementation file. Shared definitions, styles, types, and pure helpers live in dedicated non-component files beside their owner. Do not add export-only barrel or compatibility files; import the concrete owner directly.

## Guide composition

The investigator guide keeps localized content in `src/data/guide/guide.ru.json`.
Its UI is grouped under `src/components/guide` by ownership: article, catalog, flow
diagram, index, search, and symbol. Pure search and URL functions live in the guide
`utils` folder, while keyboard and focus interaction lives in `src/hooks/guide`.
Do not add `index.ts` files to this structure.

## Test structure

Tests mirror production ownership:

- `character-list-page.test.tsx` covers loading, retry, list composition, empty state and limit state.
- `create-character-modal.test.tsx` covers creation form behavior and mutation feedback.
- `character-card-actions.test.tsx` covers delete confirmation and failure feedback.
- `tests/unit` covers DTOs, API transforms, query/cache behavior and small hooks.
- `tests/fixtures` contains reusable typed data builders.
- `tests/helpers` contains shared render infrastructure.

A page suite should not absorb every workflow rendered below that page. Test the child owner directly, then keep only the integration assertion the page itself owns.

## Architecture invariants

- Protected route access is checked on the server.
- Authenticated server-state keys include the owning user identity.
- Raw form input reaches API mutations only after DTO validation and normalization.
- Feature folders compose shared UI primitives; they do not duplicate them.
- Page components coordinate feature pieces instead of implementing every field and mutation inline.
- Tests follow the same ownership boundaries as production code.
