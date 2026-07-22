"use client"

import { CharacterInfoTooltip } from "@/components/character/detail/character-info-tooltip"
import { CharacterSheetTooltipProvider } from "@/components/character/detail/character-sheet-tooltip/character-sheet-tooltip-provider"
import { CharacterAgeInfo } from "@/components/character/detail/header/character-age-info"
import { CharacterNameEditor } from "@/components/character/detail/header/character-name-editor"
import { CharacterPortraitEditor } from "@/components/character/detail/header/character-portrait-editor"
import { CharacterSexEditor } from "@/components/character/detail/header/character-sex-editor"
import {
  CHARACTER_IDENTITY_TEXT_FIELDS,
  type CharacterIdentityTextKey,
} from "@/components/character/detail/header/constants/identity-fields.constants"
import { IdentityLine } from "@/components/character/detail/header/identity-line"
import { identityFieldValue } from "@/components/character/detail/header/utils/identity-field-value.util"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import { useUpdateCharacterProfile } from "@/hooks/character/use-update-character-profile"
import { getPortraitKind, getPortraitUrl } from "@/lib/utils/portrait.util"
import type { CharacterDetail } from "@/types/character.types"

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
    switch (key) {
      case "age":
        return mutation.mutateAsync({
          age: nextValue === null ? null : Number(nextValue),
        })
      case "birthplace":
        return mutation.mutateAsync({ birthplace: nextValue })
      case "occupation":
        return mutation.mutateAsync({ occupation: nextValue })
      case "residence":
        return mutation.mutateAsync({ residence: nextValue })
    }
  }

  return (
    <CharacterSheetTooltipProvider>
      <section className="flex h-full min-w-0 self-stretch items-center gap-3 md:col-span-2 xl:col-span-1">
        <CharacterPortraitEditor
          alt={formatLocalizedTemplate(
            localizedContent.copy.characterDetailHeaderCharacterIdentitySection
              .value0PortretValue1,
            {
              value0:
                portraitKind === "female"
                  ? localizedContent.copy
                      .characterDetailHeaderCharacterIdentitySection.zhenskii
                  : localizedContent.copy
                      .characterDetailHeaderCharacterIdentitySection.muzhskoi,
              value1: character.name,
            },
          )}
          characterId={character.id}
          portraitUrl={portraitSrc}
        />
        <div className="min-w-0 flex-1">
          <CharacterNameEditor
            name={character.name}
            onSave={(name) => mutation.mutateAsync({ name })}
          />
          <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-0.5 pl-2">
            <IdentityLine
              ariaLabel={formatLocalizedTemplate(
                localizedContent.copy
                  .characterDetailHeaderCharacterIdentitySection
                  .redaktirovatPoleValue0,
                { value0: CHARACTER_IDENTITY_TEXT_FIELDS[0].label },
              )}
              className="col-span-2"
              label={CHARACTER_IDENTITY_TEXT_FIELDS[0].label}
              labelAccessory={
                <CharacterInfoTooltip
                  ariaLabel={
                    localizedContent.copy
                      .characterDetailHeaderCharacterIdentitySection
                      .informatsiyaOBonusahProfessii
                  }
                  contentClassName="w-[min(24rem,calc(100vw-2rem))] max-w-none"
                  iconClassName="size-3"
                  testId="character-occupation-info"
                  triggerClassName="size-4 text-[var(--ml-ink-muted)]"
                >
                  <div className="flex flex-col items-start gap-2 text-sm leading-relaxed">
                    <p className="font-heading text-base font-semibold">
                      {
                        localizedContent.copy
                          .characterDetailHeaderCharacterIdentitySection
                          .professiyaDopolnitelnyeVozmozhnosti
                      }
                    </p>
                    <ul className="list-disc space-y-1 pl-4">
                      <li>
                        {
                          localizedContent.copy
                            .characterDetailHeaderCharacterIdentitySection
                            .ochkiProfessionalnyhNavykovPoFormuleProfessii
                        }
                      </li>
                      <li>
                        {
                          localizedContent.copy
                            .characterDetailHeaderCharacterIdentitySection
                            .spisokNavykovDlyaRaspredeleniyaEtihOchkov
                        }
                      </li>
                      <li>
                        {
                          localizedContent.copy
                            .characterDetailHeaderCharacterIdentitySection
                            .diapazonSredstvIKreditnogoReitinga
                        }
                      </li>
                      <li>
                        {
                          localizedContent.copy
                            .characterDetailHeaderCharacterIdentitySection
                            .poleznyeSvyaziIKrugObscheniya
                        }
                      </li>
                    </ul>
                    <p className="border-t border-[#5d5231]/70 pt-2 text-[#e8d9b4]">
                      {
                        localizedContent.copy
                          .characterDetailHeaderCharacterIdentitySection
                          .znacheniyaZavisyatOtVybrannoiProfessiiPrilozhenie
                      }
                    </p>
                    <p className="text-xs opacity-70">
                      {
                        localizedContent.copy
                          .characterDetailHeaderCharacterIdentitySection
                          .kratkoeRukovodstvoPoSozdaniyuPersonazhaS
                      }
                    </p>
                  </div>
                </CharacterInfoTooltip>
              }
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
              ariaLabel={formatLocalizedTemplate(
                localizedContent.copy
                  .characterDetailHeaderCharacterIdentitySection
                  .redaktirovatPoleValue0,
                { value0: CHARACTER_IDENTITY_TEXT_FIELDS[1].label },
              )}
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
                onSave={(sex) => mutation.mutateAsync({ sex })}
                value={character.sex}
              />
            </div>
            <IdentityLine
              ariaLabel={formatLocalizedTemplate(
                localizedContent.copy
                  .characterDetailHeaderCharacterIdentitySection
                  .redaktirovatPoleValue0,
                { value0: CHARACTER_IDENTITY_TEXT_FIELDS[2].label },
              )}
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
              ariaLabel={formatLocalizedTemplate(
                localizedContent.copy
                  .characterDetailHeaderCharacterIdentitySection
                  .redaktirovatPoleValue0,
                { value0: CHARACTER_IDENTITY_TEXT_FIELDS[3].label },
              )}
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
    </CharacterSheetTooltipProvider>
  )
}
