import type { KyInstance } from "ky"
import { describe, expect, it, vi } from "vitest"

import {
  createCharacterBackstoryItem,
  deleteCharacterBackstory,
  deleteCharacterBackstoryItem,
  updateCharacterBackstoryItem,
  upsertCharacterBackstory,
} from "@/lib/api/character-backstory"
import {
  deleteCharacterFinances,
  updateCharacterFinances,
} from "@/lib/api/character-finances"
import {
  deleteCharacterNote,
  updateCharacterNote,
} from "@/lib/api/character-notes"

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
})
