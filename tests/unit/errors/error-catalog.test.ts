import { describe, expect, it } from "vitest"

import {
  getAllErrorCodes,
  getPresentedError,
  UNKNOWN_ERROR_CODE,
} from "@/lib/errors/catalog"
import { resolveError } from "@/lib/errors/utils/resolve-error-code.util"

describe("error catalog", () => {
  it("returns user-facing data for every registered code", () => {
    for (const code of getAllErrorCodes()) {
      const entry = getPresentedError(code)
      expect(entry.code).toBe(code)
      expect(entry.title).not.toBe("")
      expect(entry.action).not.toBe("")
      expect(entry.documentation.cases.length).toBeGreaterThan(0)
      expect(entry.documentation.cases[0]?.steps.length).toBeGreaterThan(0)
    }
  })

  it("preserves an unknown API code while using fallback content", async () => {
    await expect(
      resolveError({ data: { code: "future.error" } }),
    ).resolves.toEqual({
      rawCode: "future.error",
      catalogCode: UNKNOWN_ERROR_CODE,
      isKnown: false,
      source: "backend",
    })
    expect(getPresentedError("future.error")).toMatchObject({
      code: "future.error",
      catalogCode: UNKNOWN_ERROR_CODE,
      isKnown: false,
    })
  })

  it("distinguishes network failures from arbitrary errors", async () => {
    await expect(
      resolveError(new TypeError("fetch failed")),
    ).resolves.toMatchObject({
      rawCode: "client.network_unavailable",
      source: "network",
    })
    await expect(resolveError(new Error("unexpected"))).resolves.toMatchObject({
      rawCode: UNKNOWN_ERROR_CODE,
      source: "client",
    })
  })

  it.each([
    new Response("upstream failure", { status: 502 }),
    Response.json({ message: "missing code" }, { status: 500 }),
  ])(
    "classifies an HTTP response without a code as a backend error",
    async (response) => {
      await expect(resolveError({ response })).resolves.toEqual({
        rawCode: UNKNOWN_ERROR_CODE,
        catalogCode: UNKNOWN_ERROR_CODE,
        isKnown: true,
        source: "backend",
      })
    },
  )
})
