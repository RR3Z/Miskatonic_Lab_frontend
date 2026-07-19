import { RoomAccessPage } from "@/components/room/join/room-access-page"

type RoomPageProps = {
  params: Promise<{ roomId: string }>
  searchParams: Promise<{ invite?: string | string[] }>
}

export default async function RoomPage({
  params,
  searchParams,
}: RoomPageProps) {
  const [{ roomId }, { invite }] = await Promise.all([params, searchParams])
  const inviteToken = Array.isArray(invite) ? invite[0] : invite

  return <RoomAccessPage inviteToken={inviteToken} roomId={roomId} />
}
