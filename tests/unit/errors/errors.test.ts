import { server } from "@tests/mocks/server"
import { HttpResponse, http } from "msw"
import { describe, expect, it, vi } from "vitest"
import { createApiClient } from "@/lib/api/client"
import { getApiErrorCode } from "@/lib/api/errors"
import { UNKNOWN_ERROR_CODE } from "@/lib/errors/catalog"

describe("getApiErrorCode", () => {
  it("reads a backend error code from parsed HTTP error data", async () => {
    const error = { data: { code: "character.limit_reached" } }

    await expect(getApiErrorCode(error)).resolves.toBe(
      "character.limit_reached",
    )
  })

  it("ignores errors without an HTTP response", async () => {
    await expect(getApiErrorCode(new Error("failed"))).resolves.toBeNull()
  })

  it("ignores malformed HTTP error data", async () => {
    const error = { data: { code: 409 } }

    await expect(getApiErrorCode(error)).resolves.toBeNull()
  })

  it("reads a code from a real API client HTTP error", async () => {
    server.use(
      http.post("http://localhost:8000/api/failure", () =>
        HttpResponse.json({ code: "character.limit_reached" }, { status: 409 }),
      ),
    )
    const api = createApiClient(vi.fn(async () => "test-token"))

    try {
      await api.post("api/failure").json()
      throw new Error("request should fail")
    } catch (error) {
      await expect(getApiErrorCode(error)).resolves.toBe(
        "character.limit_reached",
      )
    }
  })

  it("uses the unknown code for a real non-JSON HTTP error", async () => {
    server.use(
      http.post(
        "http://localhost:8000/api/plain-failure",
        () => new HttpResponse("upstream failure", { status: 502 }),
      ),
    )
    const api = createApiClient(vi.fn(async () => "test-token"))

    try {
      await api.post("api/plain-failure").json()
      throw new Error("request should fail")
    } catch (error) {
      await expect(getApiErrorCode(error)).resolves.toBe(UNKNOWN_ERROR_CODE)
    }
  })
})
