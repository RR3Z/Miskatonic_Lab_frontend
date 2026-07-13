import type { KyInstance } from "ky"
import { describe, expect, it, vi } from "vitest"

import {
  normalizeCharacterListItem,
  uploadCharacterPortrait,
} from "@/lib/api/characters"
import type { CharacterApiListItem } from "@/types/character"

describe("character API normalization", () => {
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
    const patch = vi.fn(() => ({ json }))
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
