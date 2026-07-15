"use client"

import { buildCharacterProfileInput } from "@/components/character/detail/header/build-character-profile-input"
import { CharacterAgeInfo } from "@/components/character/detail/header/character-age-info"
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

const digitsOnly = (value: string) => value.replace(/\D/g, "")

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
    <section className="flex h-full min-w-0 self-stretch items-center gap-3 md:col-span-2 xl:col-span-1">
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
          <IdentityLine
            ariaLabel={`Редактировать поле ${CHARACTER_IDENTITY_TEXT_FIELDS[0].label}`}
            className="col-span-2"
            label={CHARACTER_IDENTITY_TEXT_FIELDS[0].label}
            onSave={(value) =>
              saveTextField(CHARACTER_IDENTITY_TEXT_FIELDS[0].key, value)
            }
            schema={CHARACTER_IDENTITY_TEXT_FIELDS[0].schema}
            testId={CHARACTER_IDENTITY_TEXT_FIELDS[0].testId}
            value={identityFieldValue(
              character,
              CHARACTER_IDENTITY_TEXT_FIELDS[0].key,
            )}
          />
          <IdentityLine
            ariaLabel={`Редактировать поле ${CHARACTER_IDENTITY_TEXT_FIELDS[1].label}`}
            label={CHARACTER_IDENTITY_TEXT_FIELDS[1].label}
            labelAccessory={<CharacterAgeInfo />}
            inputMode="numeric"
            inputPattern="[0-9]*"
            normalizeInput={digitsOnly}
            onSave={(value) =>
              saveTextField(CHARACTER_IDENTITY_TEXT_FIELDS[1].key, value)
            }
            schema={CHARACTER_IDENTITY_TEXT_FIELDS[1].schema}
            testId={CHARACTER_IDENTITY_TEXT_FIELDS[1].testId}
            value={identityFieldValue(
              character,
              CHARACTER_IDENTITY_TEXT_FIELDS[1].key,
            )}
          />
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
          <IdentityLine
            ariaLabel={`Редактировать поле ${CHARACTER_IDENTITY_TEXT_FIELDS[2].label}`}
            className="col-span-2"
            label={CHARACTER_IDENTITY_TEXT_FIELDS[2].label}
            onSave={(value) =>
              saveTextField(CHARACTER_IDENTITY_TEXT_FIELDS[2].key, value)
            }
            schema={CHARACTER_IDENTITY_TEXT_FIELDS[2].schema}
            value={identityFieldValue(
              character,
              CHARACTER_IDENTITY_TEXT_FIELDS[2].key,
            )}
          />
          <IdentityLine
            ariaLabel={`Редактировать поле ${CHARACTER_IDENTITY_TEXT_FIELDS[3].label}`}
            className="col-span-2"
            label={CHARACTER_IDENTITY_TEXT_FIELDS[3].label}
            onSave={(value) =>
              saveTextField(CHARACTER_IDENTITY_TEXT_FIELDS[3].key, value)
            }
            schema={CHARACTER_IDENTITY_TEXT_FIELDS[3].schema}
            value={identityFieldValue(
              character,
              CHARACTER_IDENTITY_TEXT_FIELDS[3].key,
            )}
          />
        </div>
      </div>
    </section>
  )
}
