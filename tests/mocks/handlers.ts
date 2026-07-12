import { HttpResponse, http } from "msw"

export const handlers = [
  http.get("http://localhost:8000/api/me", () =>
    HttpResponse.json({
      id: "test-user",
      username: "investigator",
    }),
  ),
  http.get("http://localhost:8000/api/characters/", () =>
    HttpResponse.json([
      {
        id: "character-1",
        name: "Артур Нейтан Кэллахан",
        occupation: "Антиквар",
        age: 48,
        sex: "male",
        residence: "США, Нью-Йорк",
        birthplace: "Бостон",
        portrait_url: null,
        created_at: "2026-01-01T00:00:00Z",
        updated_at: "2026-01-01T00:00:00Z",
        hp: { current_hp: 6, max_hp: 20 },
        mp: { current_mp: 9, max_mp: 25 },
        sanity: { current_sanity: 15, max_sanity: 30 },
        luck: { current_luck: 80, starting_luck: 100 },
      },
    ]),
  ),
]
