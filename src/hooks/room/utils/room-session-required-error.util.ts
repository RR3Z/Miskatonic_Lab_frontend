export class RoomSessionRequiredError extends Error {
  constructor() {
    super("A signed-in session is required to manage rooms")
    this.name = "RoomSessionRequiredError"
  }
}
