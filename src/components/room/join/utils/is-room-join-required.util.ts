import { HTTPError } from "ky"

export function isRoomJoinRequiredError(error: unknown) {
  return error instanceof HTTPError && error.response.status === 404
}
