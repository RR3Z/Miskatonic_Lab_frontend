import type { KyInstance } from "ky"
import { describe, expect, it, vi } from "vitest"

import {
  createCharacterBackstoryItem,
  deleteCharacterBackstory,
  deleteCharacterBackstoryItem,
  updateCharacterBackstoryItem,
  upsertCharacterBackstory,
} from "@/lib/api/character-backstory"
import { makeCharacterDiceRoll } from "@/lib/api/character-dice-rolls"
import {
  deleteCharacterFinances,
  updateCharacterFinances,
} from "@/lib/api/character-finances"
import {
  deleteCharacterNote,
  updateCharacterNote,
} from "@/lib/api/character-notes"
import { updateCharacterProfile } from "@/lib/api/character-profile"
import {
  deleteCharacterResource,
  updateCharacterResource,
} from "@/lib/api/character-resources"
import { deleteCharacterSkill } from "@/lib/api/character-skills"
import {
  deleteCharacterCharacteristics,
  updateCharacterCharacteristics,
} from "@/lib/api/character-statistics"

describe("character detail write API", () => {
  it("updates and deletes a note", async () => {
    const note = { id: "note-1", title: "Lead", body: "Check archive" }
    const json = vi.fn(async () => note)
    const put = vi.fn(() => ({ json }))
    const deleteRequest = vi.fn(async () => undefined)
    const api = { delete: deleteRequest, put } as unknown as KyInstance

    await expect(
      updateCharacterNote(api, "character-1", "note-1", {
        body: note.body,
        title: note.title,
      }),
    ).resolves.toBe(note)
    await deleteCharacterNote(api, "character-1", "note-1")

    expect(put).toHaveBeenCalledWith(
      "api/characters/character-1/notes/note-1/",
      { json: { body: note.body, title: note.title } },
    )
    expect(deleteRequest).toHaveBeenCalledWith(
      "api/characters/character-1/notes/note-1/",
    )
  })

  it("upserts and deletes the backstory container", async () => {
    const backstory = { id: "backstory-1", items: [] }
    const json = vi.fn(async () => backstory)
    const put = vi.fn(() => ({ json }))
    const deleteRequest = vi.fn(async () => undefined)
    const api = { delete: deleteRequest, put } as unknown as KyInstance

    await expect(
      upsertCharacterBackstory(api, "character-1", {
        personal_description: "Investigator",
      }),
    ).resolves.toBe(backstory)
    await deleteCharacterBackstory(api, "character-1")

    expect(put).toHaveBeenCalledWith("api/characters/character-1/backstory/", {
      json: { personal_description: "Investigator" },
    })
    expect(deleteRequest).toHaveBeenCalledWith(
      "api/characters/character-1/backstory/",
    )
  })

  it("ensures the backstory exists before creating an item", async () => {
    const item = {
      id: "item-1",
      section: "traits",
      text: "Observant",
      title: "Traits",
    }
    const putJson = vi.fn(async () => ({ id: "backstory-1", items: [] }))
    const postJson = vi.fn(async () => item)
    const put = vi.fn(() => ({ json: putJson }))
    const post = vi.fn(() => ({ json: postJson }))
    const api = { post, put } as unknown as KyInstance

    await expect(
      createCharacterBackstoryItem(api, "character-1", {
        section: "traits",
        text: item.text,
        title: item.title,
      }),
    ).resolves.toBe(item)

    expect(put).toHaveBeenCalledWith("api/characters/character-1/backstory/", {
      json: { personal_description: null },
    })
    expect(post).toHaveBeenCalledWith(
      "api/characters/character-1/backstory/items/",
      {
        json: {
          section: "traits",
          text: item.text,
          title: item.title,
        },
      },
    )
  })

  it("updates and deletes a backstory item", async () => {
    const input = {
      section: "traits" as const,
      text: "Observant",
      title: "Traits",
    }
    const json = vi.fn(async () => ({ id: "item-1", ...input }))
    const put = vi.fn(() => ({ json }))
    const deleteRequest = vi.fn(async () => undefined)
    const api = { delete: deleteRequest, put } as unknown as KyInstance

    await updateCharacterBackstoryItem(api, "character-1", "item-1", input)
    await deleteCharacterBackstoryItem(api, "character-1", "item-1")

    expect(put).toHaveBeenCalledWith(
      "api/characters/character-1/backstory/items/item-1/",
      { json: input },
    )
    expect(deleteRequest).toHaveBeenCalledWith(
      "api/characters/character-1/backstory/items/item-1/",
    )
  })

  it("updates and deletes finances", async () => {
    const response = { id: "finances-1", spending_limit: "$20" }
    const json = vi.fn(async () => response)
    const put = vi.fn(() => ({ json }))
    const deleteRequest = vi.fn(async () => undefined)
    const api = { delete: deleteRequest, put } as unknown as KyInstance

    await expect(
      updateCharacterFinances(api, "character-1", {
        spending_limit: "$20",
      }),
    ).resolves.toBe(response)
    await deleteCharacterFinances(api, "character-1")

    expect(put).toHaveBeenCalledWith("api/characters/character-1/finances/", {
      json: { spending_limit: "$20" },
    })
    expect(deleteRequest).toHaveBeenCalledWith(
      "api/characters/character-1/finances/",
    )
  })

  it("patches only the provided character profile fields", async () => {
    const profile = { occupation: "Professor" }
    const json = vi.fn(async () => ({ id: "character-1", ...profile }))
    const patch = vi.fn(() => ({ json }))
    const api = { patch } as unknown as KyInstance

    await updateCharacterProfile(api, "character-1", profile)

    expect(patch).toHaveBeenCalledWith("api/characters/character-1/", {
      json: profile,
    })
  })

  it("updates and deletes characteristics", async () => {
    const characteristics = {
      appearance: 40,
      constitution: 50,
      dexterity: 60,
      education: 70,
      intelligence: 80,
      power: 55,
      size: 65,
      strength: 75,
    }
    const json = vi.fn(async () => characteristics)
    const put = vi.fn(() => ({ json }))
    const deleteRequest = vi.fn(async () => undefined)
    const api = { delete: deleteRequest, put } as unknown as KyInstance

    await updateCharacterCharacteristics(api, "character-1", characteristics)
    await deleteCharacterCharacteristics(api, "character-1")

    expect(put).toHaveBeenNthCalledWith(
      1,
      "api/characters/character-1/characteristics/",
      { json: characteristics },
    )
    expect(deleteRequest).toHaveBeenCalledWith(
      "api/characters/character-1/characteristics/",
    )
  })

  it("routes resource writes and deletes to the matching subresource", async () => {
    const json = vi.fn(async () => ({ current_hp: 7, max_hp: 20 }))
    const put = vi.fn(() => ({ json }))
    const deleteRequest = vi.fn(async () => undefined)
    const api = { delete: deleteRequest, put } as unknown as KyInstance

    await updateCharacterResource(api, "character-1", {
      resource: "hp",
      values: { current_hp: 7 },
    })
    await deleteCharacterResource(api, "character-1", "sanity")

    expect(put).toHaveBeenCalledWith("api/characters/character-1/health/", {
      json: { current_hp: 7 },
    })
    expect(deleteRequest).toHaveBeenCalledWith(
      "api/characters/character-1/sanity/",
    )
  })

  it("deletes a skill by character and skill id", async () => {
    const deleteRequest = vi.fn(async () => undefined)
    const api = { delete: deleteRequest } as unknown as KyInstance

    await deleteCharacterSkill(api, "character-1", "skill-1")

    expect(deleteRequest).toHaveBeenCalledWith(
      "api/characters/character-1/skills/skill-1/",
    )
  })

  it("rolls a requested formula for a character", async () => {
    const roll = { expression: "+1d4", result: 3 }
    const json = vi.fn(async () => roll)
    const post = vi.fn(() => ({ json }))
    const api = { post } as unknown as KyInstance

    await expect(
      makeCharacterDiceRoll(api, "character-1", "+1d4"),
    ).resolves.toBe(roll)

    expect(post).toHaveBeenCalledWith("api/dice-roll/character-1/", {
      json: { expression: "+1d4" },
    })
  })

  it("sends selected d100 mode with a characteristic roll", async () => {
    const roll = { expression: "1d100", result: 42 }
    const json = vi.fn(async () => roll)
    const post = vi.fn(() => ({ json }))
    const api = { post } as unknown as KyInstance

    await expect(
      makeCharacterDiceRoll(api, "character-1", {
        expression: "1d100",
        d100Mode: "bonus",
      }),
    ).resolves.toBe(roll)

    expect(post).toHaveBeenCalledWith("api/dice-roll/character-1/", {
      json: { expression: "1d100", d100_mode: "bonus" },
    })
  })
})
