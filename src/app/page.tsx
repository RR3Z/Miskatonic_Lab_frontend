import { SignInIntent } from "@/components/auth/sign-in-intent"
import { LandingPage } from "@/components/landing/landing-page"
import { appRoutes } from "@/lib/routes/app-routes"

type HomeProps = {
  searchParams: Promise<{ "sign-in"?: string | string[] }>
}

export default async function Home({ searchParams }: HomeProps) {
  const signInIntent = (await searchParams)["sign-in"]

  return (
    <>
      {signInIntent === "characters" && (
        <SignInIntent returnTo={appRoutes.characters} />
      )}
      {signInIntent === "rooms" && <SignInIntent returnTo={appRoutes.rooms} />}
      <LandingPage />
    </>
  )
}
