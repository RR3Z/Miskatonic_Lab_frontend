export const appRoutes = {
  home: "/",
  characters: "/characters",
  character: (characterId: string) => `/characters/${characterId}`,
  charactersSignIn: "/?sign-in=characters",
  newCharacter: "/characters?create=1",
} as const
