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

## Support clearing nullable backstory and finance fields

Status: planned.

Current behavior:

- Notes, fixed backstory sections, and finances support inline create, update, and delete flows.
- The backend update queries use SQL `COALESCE`, so sending `null` preserves an existing personal description or finance value instead of clearing it.
- The frontend therefore validates edited text as non-empty and offers whole-resource deletion where the backend supports it.

Target behavior:

- Make nullable-field updates presence-aware on the backend, preferably with narrow `PATCH` semantics or explicit nullable DTO fields.
- Allow clearing `personal_description`, `spending_limit`, `cash`, `assets`, and `credit_rating_skill_id` without deleting unrelated values.
- Keep the current inline editors and update the frontend DTOs only after the backend contract distinguishes omitted fields from explicit `null`.

Acceptance criteria:

- Sending an omitted field preserves its value; sending `null` clears it.
- Clearing one field does not overwrite another backstory or finance field.
- The inline editor can save an empty nullable value and immediately reflects the backend response.

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

## Persist character conditions

Status: planned.

Current behavior:

- The six condition controls on the character sheet are local toggles initialized from `CharacterDetail`.
- Toggle changes live only in React state and reset after a page reload.
- The frontend does not send condition changes to the backend.

Target behavior:

- Persist health conditions (`major_wound`, `unconscious`, `dying`, `dead`) and sanity conditions (`temp_insanity`, `indef_insanity`) on the Character backend model.
- Add or extend a Character update endpoint and frontend mutation for condition-only changes.
- Keep the current toggle layout, active styling, `aria-pressed`, and independent Info tooltip buttons.
- Reconcile optimistic UI state with the server response and restore the previous value when saving fails.
- Invalidate or update the Character query cache after a successful save.

Acceptance criteria:

- Clicking a condition toggle persists the new value without a full page reload.
- The persisted values are restored when the character sheet is opened again.
- Saving one condition does not overwrite unrelated Character fields or other conditions.
- A failed request is visible to the user and does not leave the toggle in a false saved state.
- Mouse and keyboard interaction remain accessible; opening Info never changes the condition.

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
