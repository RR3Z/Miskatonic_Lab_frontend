export const characterQueryKeys = {
  all: ["characters"] as const,
  list: (userId: string) => ["characters", "list", userId] as const,
  detail: (userId: string, characterId: string) =>
    ["characters", "detail", userId, characterId] as const,
}
