export class CharacterSessionRequiredError extends Error {
  constructor() {
    super("an authenticated user is required for character mutations")
    this.name = "CharacterSessionRequiredError"
  }
}
