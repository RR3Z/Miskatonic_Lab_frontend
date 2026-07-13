"use client"

import { useClerk, useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useRef } from "react"

type SignInIntentProps = {
  returnTo: string
}

export function SignInIntent({ returnTo }: SignInIntentProps) {
  const { openSignIn } = useClerk()
  const { isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const handled = useRef(false)

  useEffect(() => {
    if (!isLoaded || handled.current) return

    handled.current = true

    const url = new URL(window.location.href)
    url.searchParams.delete("sign-in")
    window.history.replaceState(
      {},
      "",
      `${url.pathname}${url.search}${url.hash}`,
    )

    if (isSignedIn) {
      router.replace(returnTo)
      return
    }

    openSignIn({ forceRedirectUrl: returnTo })
  }, [isLoaded, isSignedIn, openSignIn, returnTo, router])

  return null
}
