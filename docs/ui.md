# UI Component Policy

This document is the default decision guide for shared UI work in Miskatonic Lab.

## Source and ownership

- Prefer an existing component from [shadcn/ui](https://ui.shadcn.com/docs/components) instead of building a generic primitive from scratch.
- Add component source through the **Manual** installation path and keep it in `src/components/ui`. Do not use the shadcn CLI to generate component files.
- Adapt the copied source to the project tokens in `src/app/globals.css`, but preserve component semantics, keyboard behavior, focus handling, and accessibility attributes.
- Reuse the existing project component before adding another primitive with the same role.
- Installing a missing runtime dependency is allowed only when the manually copied component requires it. The source file remains owned and editable by the project.
- Feature components belong under their feature folder. `src/components/ui` contains only reusable primitives.

## Responsive contract

- Desktop, tablet, and mobile use `SiteShell`; a separate header and footer must not be reintroduced.
- Mobile navigation is the shadcn `Sheet` branch of `Sidebar`.
- Tablet and desktop keep a visible compact sidebar rail. Expanding it overlays the page and must not reduce the content width.
- Dialogs, forms, actions, and menus must be checked at mobile, tablet, and desktop widths. Do not treat a desktop-only result as complete.
- Modal action buttons remain full width on narrow screens and share the available row width on larger screens.

## State and feedback rules

- Use `Skeleton` for initial layout loading and one accessible `role="status"` message for the whole loading region.
- Use `Spinner` inside controls for an in-progress action. Keep the control disabled while the action is pending.
- Use `Alert` for persistent, recoverable page errors and include a retry action where possible.
- Use `Sonner` for temporary operation results: success is green, error is red, warning is yellow. Toasts stay top-center and must remain readable on the page background.
- Use `AlertDialog` before irreversible actions. Confirm is red for destructive actions; cancel/accept colors follow the action meaning.
- Disabled state must use the native `disabled` attribute whenever the element supports it.

## Animation rules

- Use Motion for meaningful enter, exit, and layout transitions; do not animate every surface by default.
- Keep `MotionProvider` at the application root with `reducedMotion="user"`.
- Use `useReducedMotion` for timers, intervals, canvas, media, or other effects Motion cannot disable automatically.
- Do not add a second animation layer over shadcn Sidebar, Sheet, Dialog, Dropdown Menu, Tooltip, or other primitives that already own their transition.
- Prefer short opacity and small-distance transitions. Avoid large parallax, continuous decorative movement, and interaction-blocking sequences.
- Animated wrappers must not change semantic roles, tab order, responsive widths, or the accessible name of their content.

## Forms

- Use React Hook Form for form state and Zod DTO schemas under `src/dto/<feature>` for validation and normalization.
- Use shadcn `Field`, `Input`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `Textarea`, and related components instead of native controls in feature markup.
- Show required-field errors after submit or interaction. Do not add permanent explanatory text solely to mark optional fields.
- Keep related controls visually consistent in height, focus ring, invalid border, disabled state, and typography.

### Control variants

- `Input`, `Textarea`, and `SelectTrigger` own control surface, border, radius, focus, invalid, disabled, and internal spacing. Feature markup may provide only layout, content typography, or width classes.
- Use `variant="default"` for ordinary forms, `variant="inline"` for edit-in-place fields, and `variant="accent"` for calculator or dice expressions. Do not recreate these states with local Tailwind control classes.
- Use `size="xs" | "sm" | "default" | "lg"` for density and `align="start" | "center"` for value alignment. Do not override control height or padding locally.
- Native `<input>`, `<textarea>`, and `<select>` are allowed only inside `src/components/ui`; file inputs also use the shared `Input` component.
- Promote a repeated interaction with the same semantics into a shared primitive or feature-level component. Do not replace semantically distinct interactive cards with generic `Button` components only for visual reuse.

## Preferred component catalog

The catalog is a selection guide, not a requirement to add every component now.

| Need | Preferred shadcn/ui component |
| --- | --- |
| File or portrait upload | [Attachment](https://ui.shadcn.com/docs/components/radix/attachment) |
| User image or fallback | [Avatar](https://ui.shadcn.com/docs/components/base/avatar) |
| User action or link styled as an action | [Button](https://ui.shadcn.com/docs/components/base/button) |
| Login, creation, or content surface | [Card](https://ui.shadcn.com/docs/components/base/card) |
| Boolean consent or multi-select | [Checkbox](https://ui.shadcn.com/docs/components/base/checkbox) |
| Searchable selection | [Combobox](https://ui.shadcn.com/docs/components/base/combobox) |
| Persistent message or recoverable error | [Alert](https://ui.shadcn.com/docs/components/base/alert) |
| Irreversible action confirmation | [Alert Dialog](https://ui.shadcn.com/docs/components/base/alert-dialog) |
| Date selection | [Date Picker](https://ui.shadcn.com/docs/components/base/date-picker) |
| Focused desktop/tablet modal flow | [Dialog](https://ui.shadcn.com/docs/components/base/dialog) |
| Mobile bottom/side interaction surface | [Drawer](https://ui.shadcn.com/docs/components/base/drawer) |
| Contextual action list | [Dropdown Menu](https://ui.shadcn.com/docs/components/base/dropdown-menu) |
| Preview on pointer or keyboard focus | [Hover Card](https://ui.shadcn.com/docs/components/base/hover-card) |
| Single-line text or numeric value | [Input](https://ui.shadcn.com/docs/components/base/input) |
| Empty collection or search result | [Empty](https://ui.shadcn.com/docs/components/base/empty) |
| Short fixed selection | [Select](https://ui.shadcn.com/docs/components/base/select) |
| Top-level site navigation | [Navigation Menu](https://ui.shadcn.com/docs/components/base/navigation-menu) |
| Anchored contextual content | [Popover](https://ui.shadcn.com/docs/components/base/popover) |
| One choice from visible options | [Radio Group](https://ui.shadcn.com/docs/components/base/radio-group) |
| User-resizable work area | [Resizable](https://ui.shadcn.com/docs/components/base/resizable) |
| Real application sidebar structure | [Sidebar](https://ui.shadcn.com/docs/components/base/sidebar) |
| Visual grouping boundary | [Separator](https://ui.shadcn.com/docs/components/base/separator) |
| Initial content placeholder | [Skeleton](https://ui.shadcn.com/docs/components/base/skeleton) |
| Temporary feedback | [Sonner](https://ui.shadcn.com/docs/components/base/sonner) |
| Immediate setting toggle | [Switch](https://ui.shadcn.com/docs/components/base/switch) |
| In-progress action | [Spinner](https://ui.shadcn.com/docs/components/base/spinner) |
| Multi-line text | [Textarea](https://ui.shadcn.com/docs/components/base/textarea) |
| Compact explanation for icon controls | [Tooltip](https://ui.shadcn.com/docs/components/base/tooltip) |

The examples above are not exclusive. Select components by interaction semantics, not by the first screen where they were introduced.
