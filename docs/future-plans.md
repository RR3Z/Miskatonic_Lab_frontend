# Future Plans

## Add Character inventory

Status: planned.

Current behavior:

- `CharacterDetail` and the Character backend API do not contain inventory or equipment data.
- The separate `Инвентарь` tab shows the intended two-column inventory layout with an explicit backend-availability placeholder.
- Financial `assets` remain separate and are not used as fabricated inventory storage.

Target behavior:

- Add Character-owned inventory item persistence, validation, and authenticated CRUD routes on the backend.
- Include inventory in `CharacterDetail` or load it through a dedicated Character subresource query.
- Replace the placeholder with item creation, editing, removal, and ordering while preserving the current two-column layout.

Acceptance criteria:

- Inventory items survive a page reload and remain scoped to their Character owner.
- Creating, editing, deleting, and reordering an item updates the sheet without overwriting financial assets.
- Existing Characters without items retain the current useful empty state.

## Support clearing nullable partial-update fields

Status: planned.

Current behavior:

- Notes, fixed backstory sections, and finances support inline create, update, and delete flows.
- The backend partial-update queries use SQL `COALESCE`, so sending `null` preserves an existing personal description, derived stat, or finance value instead of clearing it.
- The frontend therefore validates edited text as non-empty and offers whole-resource deletion where the backend supports it.

Target behavior:

- Make nullable-field updates presence-aware on the backend, preferably with narrow `PATCH` semantics or explicit nullable DTO fields.
- Allow clearing `personal_description`, nullable derived stats, `spending_limit`, `cash`, `assets`, and `credit_rating_skill_id` without deleting unrelated values.
- Keep the current inline editors and update the frontend DTOs only after the backend contract distinguishes omitted fields from explicit `null`.

Acceptance criteria:

- Sending an omitted field preserves its value; sending `null` clears it.
- Clearing one field does not overwrite another backstory or finance field.
- The inline editor can save an empty nullable value and immediately reflects the backend response.

## Enforce one backstory item per fixed section

Status: planned.

Current behavior:

- The frontend renders one fixed Textarea for every backstory section and creates an item with that section's canonical title.
- The backend validates the section name, but the database has no uniqueness constraint for `(backstory_id, section)`.
- Creating the same section twice is therefore possible through concurrent or direct API requests; the frontend displays only the first matching item.

Target behavior:

- Add a database uniqueness constraint for `(backstory_id, section)`.
- Map a duplicate-section write to a stable Character API conflict error.
- Keep section labels fixed by the frontend and preserve the existing create, update, and delete routes.

Acceptance criteria:

- One Character backstory cannot contain two items for the same fixed section.
- A duplicate create returns a documented conflict response and does not modify the existing item.
- Updating an item cannot move it into an already occupied section.
- The current one-Textarea-per-section frontend flow requires no data-merging or legacy compatibility path.

## Add Character weapons and attacks

Status: planned.

Current behavior:

- `CharacterDetail` and the Character backend API do not contain weapon, attack, ammunition, or combat-move data.
- The `Оружие и атаки` tab shows an explicit backend-availability placeholder.

Target behavior:

- Add Character-owned weapon and attack models, persistence, validation, and authenticated CRUD routes on the backend.
- Include the data in `CharacterDetail` or load it through a dedicated Character subresource query.
- Replace the frontend placeholder with weapon cards containing the fields required by the Call of Cthulhu sheet.
- Keep the tab usable for both predefined weapons and custom investigator attacks.

Acceptance criteria:

- Weapons and attacks survive a page reload and remain scoped to their Character owner.
- The sheet can display weapon name, skill, damage, range, attacks, ammunition, and malfunction value where applicable.
- Empty Characters retain a useful empty state instead of fabricated weapon data.

## Seed default skills and support custom skills

Status: planned.

Current behavior:

- A newly created Character has no guaranteed baseline skill set.
- The character sheet shows a disabled plus button for future custom-skill creation.
- Character detail responses do not expose the category and specialty identifiers required by the existing backend skill write routes.
- Existing skills can be deleted because that route only requires the skill identifier; create and update remain unavailable in the frontend.

Target behavior:

- Automatically create the standard Call of Cthulhu investigator skills when a Character is created.
- Initialize every standard skill with its official starting value.
- Keep character creation atomic: do not leave a partially initialized Character when default-skill creation fails.
- Enable the plus button in the skills header and use it to create custom Character skills.
- Expose a skill-category and specialty catalog, or include their identifiers in `CharacterSkill`, so the frontend can build valid create and update payloads.
- Keep default and custom skills compatible with the existing alphabetical sheet layout.

Acceptance criteria:

- Every newly created Character immediately returns the complete standard skill set with starting values.
- Existing Characters can be backfilled without duplicating skills they already own.
- Creating a custom skill adds only that skill and does not modify the standard set.
- Reloading the character sheet preserves both standard and custom skills.

## Support portrait removal

Status: planned.

Current behavior:

- Character portraits can be uploaded during creation and replaced from the character sheet.
- The backend `PATCH /api/characters/{id}/` contract requires a portrait file and does not expose a portrait-only removal operation.

Target behavior:

- Add a narrow authenticated portrait-removal route without changing unrelated Character fields.
- Delete the stored portrait object and clear its database key as one operation.
- Add a remove action to the existing portrait editor and restore the sex-based placeholder after success.

Acceptance criteria:

- Removing a portrait does not delete or rewrite the Character.
- The stored file and database key are both removed.
- The character sheet shows its placeholder without requiring a full reload.

## Replace URL-driven character creation modal state

Status: planned.

Current behavior:

- `appRoutes.newCharacter` points to `/characters?create=1`.
- `CharacterListPage` reads the query parameter, opens `CreateCharacterModal`, and removes the parameter with `history.replaceState`.

Target behavior:

- Keep only real page URLs in `appRoutes`.
- Remove `newCharacter`, `?create=1`, the URL-reading effect, and manual `history.replaceState`.
- Mount one shared `CreateCharacterModal` in a global dialog provider or app-level UI layer.
- Store its open state in an explicit Zustand UI store with `openDialog()` and `closeDialog()` actions.
- Make creation triggers on the landing page and character list call the store action directly.
- Keep URL-backed modal state only if deep linking, refresh restoration, or browser Back/Forward behavior becomes a product requirement. In that case, use a real `/characters/new` route with Next.js Intercepting and Parallel Routes instead of a query flag.

Acceptance criteria:

- Opening the creation modal does not change the URL.
- `appRoutes` contains only navigable pages.
- No component checks `create=1` or manually rewrites browser history.
- Every creation trigger opens the same modal instance.
- Successful creation still invalidates the character query and preserves current responsive behavior.

## Optimize above-the-fold character images

Status: planned.

Current behavior:

- Browser smoke reports Next.js LCP warnings for the app favicon and the character portrait placeholder.
- The images render correctly, but above-the-fold loading intent is not declared explicitly.

Target behavior:

- Identify which logo and portrait image is actually the LCP candidate on the character list and detail pages.
- Mark only above-the-fold candidates for eager or priority loading.
- Keep off-screen character card portraits lazy-loaded to avoid unnecessary network work.

Acceptance criteria:

- Character list and detail smoke tests do not report image LCP warnings.
- The first visible logo and portrait load without a delayed placeholder flash.
- Off-screen portraits remain lazy-loaded.
