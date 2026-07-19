import { describe, expect, it } from "vitest"

import {
  getAllErrorCodes,
  getPresentedError,
  UNKNOWN_ERROR_CODE,
} from "@/lib/errors/catalog"
import { resolveErrorCode } from "@/lib/errors/resolve-error-code"

describe("error catalog", () => {
  it("returns user-facing data for every registered code", () => {
    for (const code of getAllErrorCodes()) {
      const entry = getPresentedError(code)
      expect(entry.code).toBe(code)
      expect(entry.title).not.toBe("")
      expect(entry.documentation.cases.length).toBeGreaterThan(0)
      expect(entry.documentation.cases[0]?.steps.length).toBeGreaterThan(0)
    }
  })

  it("uses client fallback for unknown API code", async () => {
    await expect(
      resolveErrorCode({ data: { code: "future.error" } }),
    ).resolves.toBe(UNKNOWN_ERROR_CODE)
  })

  it("uses network fallback when no response exists", async () => {
    await expect(resolveErrorCode(new Error("offline"))).resolves.toBe(
      "client.network_unavailable",
    )
  })
})
