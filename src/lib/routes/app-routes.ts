export const appRoutes = {
  home: "/",
  guide: "/guide",
  guideSection: (slug: string) => `/guide/${slug}`,
  characters: "/characters",
  character: (characterId: string) => `/characters/${characterId}`,
  rooms: "/rooms",
  room: (roomId: string) => `/rooms/${roomId}`,
  charactersSignIn: "/?sign-in=characters",
  newCharacter: "/characters?create=1",
} as const
