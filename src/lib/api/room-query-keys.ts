export const roomQueryKeys = {
  all: ["rooms"] as const,
  list: (userId: string) => ["rooms", "list", userId] as const,
  detail: (userId: string, roomId: string) =>
    ["rooms", "detail", userId, roomId] as const,
  events: (userId: string, roomId: string) =>
    ["rooms", "events", userId, roomId] as const,
  selectedCharacters: (userId: string, roomId: string) =>
    ["rooms", "selected-characters", userId, roomId] as const,
} as const
