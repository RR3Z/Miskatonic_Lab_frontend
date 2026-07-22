import { readdirSync, readFileSync } from "node:fs"
import { basename, join, relative, resolve } from "node:path"
import { describe, expect, it } from "vitest"

import { formatRoomTemplate } from "@/components/room/utils/format-room-template.util"
import roomContentRu from "@/data/room/room.ru.json"
import { roomCatalogRefreshIntervalMs } from "@/hooks/room/constants/room-catalog-refresh.constants"
import { parseRoomSocketEvent } from "@/hooks/room/utils/room-socket-payload.util"
import { getPresentedError, UNKNOWN_ERROR_CODE } from "@/lib/errors/catalog"

const roomComponentsDirectory = resolve(process.cwd(), "src/components/room")

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return filesIn(path)
    return [path]
  })
}

describe("Rooms refactor policy", () => {
  it("uses direct UTF-8 JSON imports in every room scenario", () => {
    const scenarioFiles = [
      "catalog/room-catalog-page.tsx",
      "create/create-room-modal.tsx",
      "join/room-join-form.tsx",
      "detail/room-detail-page.tsx",
      "chat/room-chat.tsx",
    ]

    for (const file of scenarioFiles) {
      const source = readFileSync(join(roomComponentsDirectory, file), "utf8")
      expect(source).toContain('from "@/data/room/room.ru.json"')
    }
  })

  it("keeps one React component per file and no barrel or data-wrapper files", () => {
    const files = filesIn(roomComponentsDirectory)
    const componentFiles = files.filter((path) => path.endsWith(".tsx"))
    const utilities = files.filter((path) => path.endsWith(".util.ts"))

    const fileNames = files.map((path) => basename(path))

    expect(fileNames).not.toContain("index.ts")
    expect(fileNames).not.toContain("index.tsx")
    expect(fileNames).not.toContain("room-content.data.ts")
    expect(fileNames).not.toContain("room-errors.data.ts")
    expect(
      componentFiles.map((path) =>
        relative(roomComponentsDirectory, path).replaceAll("\\", "/"),
      ),
    ).not.toContain("input.tsx")
    expect(
      utilities.map((path) =>
        relative(roomComponentsDirectory, path).replaceAll("\\", "/"),
      ),
    ).toEqual(
      expect.arrayContaining([
        "utils/format-room-created-at.util.ts",
        "utils/format-room-template.util.ts",
        "utils/has-room-character.util.ts",
        "utils/room-chat-payload.util.ts",
        "utils/room-socket-status.util.ts",
        "utils/room-event-user-id.util.ts",
        "join/utils/is-room-join-required.util.ts",
        "detail/utils/room-invite-link.util.ts",
      ]),
    )

    for (const file of componentFiles) {
      const source = readFileSync(file, "utf8")
      const declarations =
        source.match(/(?:export )?function [A-Z][A-Za-z0-9]*/g) ?? []
      expect(
        declarations,
        relative(roomComponentsDirectory, file),
      ).toHaveLength(1)
    }
  })

  it("formats localized room templates with an em dash", () => {
    const summary = formatRoomTemplate(roomContentRu.join.summary, {
      maxPlayers: 7,
      members: 2,
      name: "Аркхэм",
    })

    expect(summary).toBe("Аркхэм — 2 / 7 игроков")
    expect(summary).not.toContain("·")
  })

  it("presents every backend room error with code and catalog explanation", () => {
    const roomCodes = [
      "room.invalid_input",
      "room.not_found",
      "room.not_member",
      "room.not_owner",
      "room.full",
      "room.already_member",
      "room.cannot_kick_owner",
      "room.character_not_owned",
      "room.invalid_id",
    ]

    for (const code of roomCodes) {
      const entry = getPresentedError(code)
      expect(entry.code).toBe(code)
      expect(entry.title).not.toBe("")
      expect(entry.toastSummary).not.toBe("")
      expect(entry.documentation.cases.length).toBeGreaterThan(0)
    }
  })

  it("uses safe network and unknown error fallbacks", () => {
    expect(getPresentedError("not-a-room-code").code).toBe(UNKNOWN_ERROR_CODE)
    expect(getPresentedError("client.network_unavailable").code).toBe(
      "client.network_unavailable",
    )
  })

  it("parses only valid websocket room events", () => {
    expect(
      parseRoomSocketEvent(
        JSON.stringify({
          actor_id: "user-1",
          payload: { text: "Привет" },
          room_id: "room-1",
          sequence: 1,
          type: "chat.message",
        }),
      ),
    ).toMatchObject({ room_id: "room-1", type: "chat.message" })
    expect(parseRoomSocketEvent('{"type":"chat.message"}')).toBeNull()
    expect(parseRoomSocketEvent({})).toBeNull()
  })

  it("refreshes only the room catalog every five minutes without realtime transport", () => {
    const catalogHook = readFileSync(
      resolve(process.cwd(), "src/hooks/room/use-rooms.ts"),
      "utf8",
    )

    expect(roomCatalogRefreshIntervalMs).toBe(5 * 60 * 1_000)
    expect(catalogHook).toContain(
      "refetchInterval: roomCatalogRefreshIntervalMs",
    )
    expect(catalogHook).toContain("refetchOnWindowFocus: false")
    expect(catalogHook).toContain("refetchOnReconnect: false")
    expect(catalogHook).not.toContain("useRoomSocket")
    expect(catalogHook).not.toContain("WebSocket")
  })
})
