"use client"

import { buildCharacterProfileInput } from "@/components/character/detail/header/build-character-profile-input"
import { CharacterNameEditor } from "@/components/character/detail/header/character-name-editor"
import { CharacterPortraitEditor } from "@/components/character/detail/header/character-portrait-editor"
import { CharacterSexEditor } from "@/components/character/detail/header/character-sex-editor"
import {
  CHARACTER_IDENTITY_TEXT_FIELDS,
  type CharacterIdentityTextKey,
} from "@/components/character/detail/header/identity-field-definitions"
import { identityFieldValue } from "@/components/character/detail/header/identity-field-value"
import { IdentityLine } from "@/components/character/detail/header/identity-line"
import { useUpdateCharacterProfile } from "@/lib/api/use-character-profile"
import { getPortraitKind, getPortraitUrl } from "@/lib/utils/portrait.util"
import type { CharacterDetail } from "@/types/character"

type CharacterIdentitySectionProps = {
  character: CharacterDetail
}

export function CharacterIdentitySection({
  character,
}: CharacterIdentitySectionProps) {
  const portraitKind = getPortraitKind(character.sex)
  const portraitSrc = getPortraitUrl(character.portrait_url, character.sex)
  const mutation = useUpdateCharacterProfile(character.id)

  function saveTextField(key: CharacterIdentityTextKey, value: string) {
    const nextValue = value === "" ? null : value
    return mutation.mutateAsync(
      buildCharacterProfileInput(character, {
        [key]:
          key === "age" && nextValue !== null ? Number(nextValue) : nextValue,
      }),
    )
  }

  return (
    <section className="flex h-full min-w-0 self-stretch items-center gap-3">
      <CharacterPortraitEditor
        alt={`${portraitKind === "female" ? "Женский" : "Мужской"} портрет ${character.name}`}
        characterId={character.id}
        portraitUrl={portraitSrc}
      />
      <div className="min-w-0 flex-1">
        <CharacterNameEditor
          name={character.name}
          onSave={(name) =>
            mutation.mutateAsync(
              buildCharacterProfileInput(character, { name }),
            )
          }
        />
        <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5">
          {CHARACTER_IDENTITY_TEXT_FIELDS.slice(0, 3).map((field) => (
            <IdentityLine
              ariaLabel={`Редактировать поле ${field.label}`}
              key={field.key}
              label={field.label}
              onSave={(value) => saveTextField(field.key, value)}
              schema={field.schema}
              testId={"testId" in field ? field.testId : undefined}
              value={identityFieldValue(character, field.key)}
            />
          ))}
          <div data-testid="character-sex">
            <CharacterSexEditor
              onSave={(sex) =>
                mutation.mutateAsync(
                  buildCharacterProfileInput(character, { sex }),
                )
              }
              value={character.sex}
            />
          </div>
          <div className="col-span-2">
            {CHARACTER_IDENTITY_TEXT_FIELDS.slice(3).map((field) => (
              <IdentityLine
                ariaLabel={`Редактировать поле ${field.label}`}
                key={field.key}
                label={field.label}
                onSave={(value) => saveTextField(field.key, value)}
                schema={field.schema}
                value={identityFieldValue(character, field.key)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
