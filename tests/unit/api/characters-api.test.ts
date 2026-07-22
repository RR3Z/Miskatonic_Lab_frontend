import type { KyInstance } from "ky"
import { describe, expect, it, vi } from "vitest"
import { createCharacterNote } from "@/lib/api/character-notes"
import {
  createCharacterWithPortrait,
  fetchCharacter,
  normalizeCharacterListItem,
  uploadCharacterPortrait,
} from "@/lib/api/characters"
import type { CharacterApiListItem } from "@/types/character.types"

describe("character API normalization", () => {
  it("fetches the full character aggregate by id", async () => {
    const detail = { id: "character-1", name: "Armitage" }
    const json = vi.fn(async () => detail)
    const get = vi.fn(() => ({ json }))
    const api = { get } as unknown as KyInstance

    await expect(fetchCharacter(api, "character-1")).resolves.toBe(detail)
    expect(get).toHaveBeenCalledWith("api/characters/character-1/")
  })

  it("normalizes backend snake-case stats into card values", () => {
    const apiCharacter: CharacterApiListItem = {
      id: "character-1",
      name: "Артур Нейтан Кэллахан",
      occupation: "Антиквар",
      age: 48,
      sex: null,
      residence: "США, Нью-Йорк",
      birthplace: null,
      portrait_url: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      hp: { current_hp: 6, max_hp: 20 },
      mp: { current_mp: 9, max_mp: 25 },
      sanity: { current_sanity: 15, max_sanity: 30 },
      luck: { current_luck: 80, starting_luck: 100 },
    }

    expect(normalizeCharacterListItem(apiCharacter)).toMatchObject({
      hp: { current: 6, max: 20 },
      mp: { current: 9, max: 25 },
      sanity: { current: 15, max: 30 },
      luck: { current: 80, starting: 100 },
    })
  })

  it("defaults missing stat rows to zeroes", () => {
    const apiCharacter: CharacterApiListItem = {
      id: "character-1",
      name: "Черновик",
      occupation: null,
      age: null,
      sex: null,
      residence: null,
      birthplace: null,
      portrait_url: null,
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z",
      hp: null,
      mp: null,
      sanity: null,
      luck: null,
    }

    expect(normalizeCharacterListItem(apiCharacter)).toMatchObject({
      hp: { current: 0, max: 0 },
      mp: { current: 0, max: 0 },
      sanity: { current: 0, max: 0 },
      luck: { current: 0, starting: 0 },
    })
  })
})

describe("character note API", () => {
  it("creates a note under the selected character", async () => {
    const note = {
      body: "Inspect the archive.",
      character_id: "character-1",
      created_at: "2026-01-01T00:00:00Z",
      id: "note-1",
      title: "Lead",
      updated_at: "2026-01-01T00:00:00Z",
    }
    const json = vi.fn(async () => note)
    const post = vi.fn(() => ({ json }))
    const api = { post } as unknown as KyInstance

    await expect(
      createCharacterNote(api, "character-1", {
        body: note.body,
        title: note.title,
      }),
    ).resolves.toEqual(note)
    expect(post).toHaveBeenCalledWith("api/characters/character-1/notes/", {
      json: { body: note.body, title: note.title },
    })
  })
})

describe("character portrait API", () => {
  it("sends the selected file as portrait multipart field", async () => {
    const response = {
      id: "character-1",
      name: "Lavinia",
      age: null,
      sex: "female",
      portrait_url: "http://localhost:8000/uploads/portraits/portrait.png",
    }
    const json = vi.fn(async () => response)
    const patch = vi.fn((_path: string, _options: { body: FormData }) => ({
      json,
    }))
    const api = { patch } as unknown as KyInstance
    const portrait = new File(["portrait"], "portrait.png", {
      type: "image/png",
    })

    await expect(
      uploadCharacterPortrait(api, "character-1", portrait),
    ).resolves.toEqual(response)

    const [path, options] = patch.mock.calls[0]
    expect(path).toBe("api/characters/character-1/")
    expect(options.body).toBeInstanceOf(FormData)
    expect((options.body as FormData).get("portrait")).toBe(portrait)
  })
})

describe("character creation workflow", () => {
  const created = {
    age: null,
    id: "character-1",
    name: "Armitage",
    portrait_url: null,
    sex: null,
  }

  it("reports when no portrait was requested", async () => {
    const post = vi.fn(() => ({ json: vi.fn(async () => created) }))
    const api = { post } as unknown as KyInstance

    await expect(
      createCharacterWithPortrait(api, {
        age: null,
        name: created.name,
        portrait: null,
        sex: null,
      }),
    ).resolves.toEqual({
      character: created,
      portraitStatus: "not_requested",
    })
  })

  it("returns the uploaded character after portrait success", async () => {
    const portrait = new File(["portrait"], "portrait.png", {
      type: "image/png",
    })
    const uploaded = {
      ...created,
      portrait_url: "http://localhost:8000/uploads/portrait.png",
    }
    const post = vi.fn(() => ({ json: vi.fn(async () => created) }))
    const patch = vi.fn(() => ({ json: vi.fn(async () => uploaded) }))
    const api = { patch, post } as unknown as KyInstance

    await expect(
      createCharacterWithPortrait(api, {
        age: null,
        name: created.name,
        portrait,
        sex: null,
      }),
    ).resolves.toEqual({
      character: uploaded,
      portraitStatus: "uploaded",
    })
  })

  it("keeps successful creation when portrait upload fails", async () => {
    const portrait = new File(["portrait"], "portrait.png", {
      type: "image/png",
    })
    const post = vi.fn(() => ({ json: vi.fn(async () => created) }))
    const patch = vi.fn(() => ({
      json: vi.fn(async () => {
        throw new Error("upload failed")
      }),
    }))
    const api = { patch, post } as unknown as KyInstance

    await expect(
      createCharacterWithPortrait(api, {
        age: null,
        name: created.name,
        portrait,
        sex: null,
      }),
    ).resolves.toEqual({
      character: created,
      portraitStatus: "failed",
    })
  })
})
