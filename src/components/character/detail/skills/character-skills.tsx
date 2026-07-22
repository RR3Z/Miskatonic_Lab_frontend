"use client"

import { Plus, Search, X } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useMemo, useState } from "react"
import { CharacterSkillEditorDialog } from "@/components/character/detail/skills/character-skill-editor-dialog"
import { CharacterSkillRow } from "@/components/character/detail/skills/character-skill-row"
import { groupCharacterSkills } from "@/components/character/detail/skills/utils/group-character-skills.util"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area/scroll-area"
import localizedContent from "@/data/locales/ru/character/detail.ru.json"
import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"
import { useCreateCharacterSkill } from "@/hooks/character/use-create-character-skill"
import type {
  CharacterCharacteristics,
  CharacterSkill,
} from "@/types/character.types"

export function CharacterSkills({
  characterId,
  characteristics,
  skills,
}: {
  characterId: string
  characteristics: Pick<CharacterCharacteristics, "dexterity" | "education">
  skills: CharacterSkill[] | null
}) {
  const createMutation = useCreateCharacterSkill(characterId)
  const [isCreating, setIsCreating] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const shouldReduceMotion = Boolean(useReducedMotion())
  const normalizedSearchQuery = searchQuery.trim().toLocaleLowerCase("ru-RU")
  const filteredSkills = useMemo(() => {
    const allSkills = skills ?? []
    if (!normalizedSearchQuery) return allSkills

    return allSkills.filter((skill) =>
      skill.name.toLocaleLowerCase("ru-RU").includes(normalizedSearchQuery),
    )
  }, [normalizedSearchQuery, skills])
  const groups = useMemo(
    () => groupCharacterSkills(filteredSkills),
    [filteredSkills],
  )
  const hasSkills = (skills?.length ?? 0) > 0
  const motionTransition = shouldReduceMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: [0.22, 1, 0.36, 1] as const }

  function getUnavailableReason(skill: CharacterSkill) {
    if (skill.base_rule === "dodge" && characteristics.dexterity === null) {
      return localizedContent.copy.characterDetailSkillsCharacterSkills
        .snachalaZapolniteHarakteristikuLovkostBezNee
    }
    if (
      skill.base_rule === "native_language" &&
      characteristics.education === null
    ) {
      return localizedContent.copy.characterDetailSkillsCharacterSkills
        .snachalaZapolniteHarakteristikuObrazovanieBezNee
    }
    return null
  }

  return (
    <section
      className="@container/skills flex h-full min-h-0 flex-col"
      data-testid="character-skills"
    >
      <div className="mb-4 grid shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 border-b border-[var(--ml-border-subtle)] pb-2">
        <h2 className="font-heading text-xl font-semibold tracking-wide text-[var(--ml-ink-primary)]">
          {localizedContent.copy.characterDetailSkillsCharacterSkills.navyki}
        </h2>
        <div className="relative min-w-0 w-full max-w-sm justify-self-end">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 z-10 size-3.5 -translate-y-1/2 text-[var(--ml-ink-muted)]"
          />
          <Input
            aria-label={
              localizedContent.copy.characterDetailSkillsCharacterSkills
                .poiskNavykov
            }
            className="h-8 pr-9 pl-8 [&::-webkit-search-cancel-button]:appearance-none"
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={
              localizedContent.copy.characterDetailSkillsCharacterSkills
                .poiskNavykov2
            }
            type="search"
            value={searchQuery}
          />
          <AnimatePresence initial={false}>
            {searchQuery ? (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-y-0 right-1 flex items-center"
                exit={{ opacity: 0, scale: 0.75 }}
                initial={
                  shouldReduceMotion ? false : { opacity: 0, scale: 0.75 }
                }
                transition={motionTransition}
              >
                <Button
                  aria-label={
                    localizedContent.copy.characterDetailSkillsCharacterSkills
                      .ochistitPoiskNavykov
                  }
                  className="size-6"
                  onClick={() => setSearchQuery("")}
                  size="icon-xs"
                  type="button"
                  variant="ghost"
                >
                  <X aria-hidden="true" />
                </Button>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
        <Button
          aria-label={
            localizedContent.copy.characterDetailSkillsCharacterSkills
              .dobavitSobstvennyiNavyk
          }
          className="size-7 shrink-0"
          onClick={() => setIsCreating(true)}
          size="icon-sm"
          title={
            localizedContent.copy.characterDetailSkillsCharacterSkills
              .dobavitSobstvennyiNavyk
          }
          type="button"
          variant="secondary"
        >
          <Plus aria-hidden="true" className="size-4" />
        </Button>
      </div>

      <ScrollArea
        className="min-h-0 flex-1"
        data-testid="character-skills-scroll-area"
      >
        {!hasSkills ? (
          <p className="rounded-sm border border-dashed border-[var(--ml-border-subtle)] px-4 py-8 text-center font-body text-sm text-[var(--ml-ink-muted)]">
            {
              localizedContent.copy.characterDetailSkillsCharacterSkills
                .navykiPersonazhaPokaNeDobavleny
            }
          </p>
        ) : groups.length === 0 ? (
          <p className="rounded-sm border border-dashed border-[var(--ml-border-subtle)] px-4 py-8 text-center font-body text-sm text-[var(--ml-ink-muted)]">
            {
              localizedContent.copy.characterDetailSkillsCharacterSkills
                .navykiNeNaideny
            }
          </p>
        ) : (
          <div
            className="grid grid-cols-1 gap-4 pr-3 pb-4 @[32rem]/skills:grid-cols-2 @[44rem]/skills:grid-cols-3 @[52rem]/skills:grid-cols-4"
            data-testid="character-skill-groups"
          >
            <AnimatePresence initial={false} mode="popLayout">
              {groups.map((group) => (
                <motion.section
                  animate={{ opacity: 1, y: 0 }}
                  aria-label={formatLocalizedTemplate(
                    localizedContent.copy.characterDetailSkillsCharacterSkills
                      .navykiNaBukvuValue0,
                    { value0: group.initial },
                  )}
                  className="min-w-0"
                  data-testid="character-skill-group"
                  exit={{ opacity: 0, y: -4 }}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                  key={group.initial}
                  layout={shouldReduceMotion ? false : "position"}
                  transition={motionTransition}
                >
                  <div className="mb-1.5 flex items-center gap-2">
                    <h3 className="font-heading text-lg font-semibold text-[var(--ml-accent-brass-strong)]">
                      {group.initial}
                    </h3>
                    <span
                      aria-hidden="true"
                      className="h-px flex-1 bg-[var(--ml-border-aged)]/70"
                    />
                  </div>
                  <ul className="space-y-1.5">
                    <AnimatePresence initial={false} mode="popLayout">
                      {group.skills.map((skill) => (
                        <CharacterSkillRow
                          characterId={characterId}
                          key={skill.id}
                          reducedMotion={shouldReduceMotion}
                          skill={skill}
                          unavailableReason={getUnavailableReason(skill)}
                        />
                      ))}
                    </AnimatePresence>
                  </ul>
                </motion.section>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>

      <CharacterSkillEditorDialog
        initialValue={{ name: "", base_value: 0, value: 0, checked: false }}
        isPending={createMutation.isPending}
        onOpenChange={setIsCreating}
        onSubmit={createMutation.mutateAsync}
        open={isCreating}
        title={
          localizedContent.copy.characterDetailSkillsCharacterSkills
            .dobavitNavyk
        }
      />
    </section>
  )
}
