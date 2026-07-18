import { server } from "@tests/mocks/server"
import { HttpResponse, http } from "msw"
import { describe, expect, it, vi } from "vitest"
import { createApiClient } from "@/lib/api/client"

describe("API client authentication", () => {
  it("adds the current Clerk token as a Bearer authorization header", async () => {
    const getToken = vi.fn().mockResolvedValue("test-token")

    server.use(
      http.get("http://localhost:8000/api/auth-check", ({ request }) => {
        return HttpResponse.json({
          authorization: request.headers.get("Authorization"),
        })
      }),
    )

    const api = createApiClient(getToken)
    const response = await api
      .get("api/auth-check")
      .json<{ authorization: string | null }>()

    expect(response.authorization).toBe("Bearer test-token")
    expect(getToken).toHaveBeenCalledOnce()
  })

  it("omits authorization when Clerk has no session token", async () => {
    const getToken = vi.fn().mockResolvedValue(null)

    server.use(
      http.get("http://localhost:8000/api/auth-check", ({ request }) => {
        return HttpResponse.json({
          authorization: request.headers.get("Authorization"),
        })
      }),
    )

    const api = createApiClient(getToken)
    const response = await api
      .get("api/auth-check")
      .json<{ authorization: string | null }>()

    expect(response.authorization).toBeNull()
  })

  it("requests a fresh token before every request", async () => {
    const getToken = vi
      .fn()
      .mockResolvedValueOnce("first-token")
      .mockResolvedValueOnce("second-token")
    const receivedTokens: Array<string | null> = []

    server.use(
      http.get("http://localhost:8000/api/auth-check", ({ request }) => {
        receivedTokens.push(request.headers.get("Authorization"))
        return new HttpResponse(null, { status: 204 })
      }),
    )

    const api = createApiClient(getToken)
    await api.get("api/auth-check")
    await api.get("api/auth-check")

    expect(receivedTokens).toEqual([
      "Bearer first-token",
      "Bearer second-token",
    ])
    expect(getToken).toHaveBeenCalledTimes(2)
  })
})
