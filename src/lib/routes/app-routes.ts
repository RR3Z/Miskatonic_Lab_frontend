export const appRoutes = {
  home: "/",
  guide: "/guide",
  guideSection: (slug: string) => `/guide/${slug}`,
  characters: "/characters",
  character: (characterId: string) => `/characters/${characterId}`,
  charactersSignIn: "/?sign-in=characters",
  newCharacter: "/characters?create=1",
} as const
