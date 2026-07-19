import { readdirSync, readFileSync } from "node:fs"
import { basename, join, relative, resolve } from "node:path"
import { describe, expect, it } from "vitest"

import { formatRoomTemplate } from "@/components/room/utils/format-room-template.util"
import {
  getRoomErrorCode,
  presentRoomError,
} from "@/components/room/utils/room-error-presenter.util"
import roomErrorsRu from "@/data/errors/room-errors.ru.json"
import roomContentRu from "@/data/room/room.ru.json"
import { parseRoomSocketEvent } from "@/hooks/room/utils/room-socket-payload.util"

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
        "utils/room-error-presenter.util.ts",
        "utils/room-socket-status.util.ts",
        "create/utils/room-invite-link.util.ts",
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

  it("presents every backend room error with code, explanation and action", () => {
    for (const [code, entry] of Object.entries(roomErrorsRu)) {
      const message = presentRoomError({ data: { code } })
      expect(message).toContain(code)
      expect(message).toContain(entry.title)
      expect(message).toContain(entry.message)
      expect(message).toContain(`Действие: ${entry.action}`)
    }
  })

  it("uses safe network and unknown error fallbacks", () => {
    expect(getRoomErrorCode(new Error("offline"))).toBe("network.error")
    expect(getRoomErrorCode({ data: { code: "not-a-room-code" } })).toBe(
      "unknown.error",
    )
    expect(presentRoomError(new Error("offline"))).toContain("network.error")
    expect(presentRoomError({ data: {} })).toContain("unknown.error")
  })

  it("parses only valid websocket room events", () => {
    expect(
      parseRoomSocketEvent(
        JSON.stringify({
          actor_id: "user-1",
          payload: { text: "Привет" },
          room_id: "room-1",
          type: "chat.message",
        }),
      ),
    ).toMatchObject({ room_id: "room-1", type: "chat.message" })
    expect(parseRoomSocketEvent('{"type":"chat.message"}')).toBeNull()
    expect(parseRoomSocketEvent({})).toBeNull()
  })
})
