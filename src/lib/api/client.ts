import ky from "ky"

export function createApiClient(getToken: () => Promise<string | null>) {
  const prefixUrl = (
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000"
  ).replace(/\/+$/, "")

  return ky.create({
    prefix: prefixUrl,
    hooks: {
      beforeRequest: [
        async ({ request }) => {
          const token = await getToken()
          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`)
          }
        },
      ],
    },
  })
}
