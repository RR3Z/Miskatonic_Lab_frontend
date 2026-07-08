import { HttpResponse, http } from "msw"

export const handlers = [
  http.get("http://localhost:8000/api/me", () =>
    HttpResponse.json({
      id: "test-user",
      username: "investigator",
    }),
  ),
]
