const placeholderMarker = "replace_me"

function hasConfiguredKey(value: string | undefined) {
  return Boolean(value) && !value?.includes(placeholderMarker)
}

export function hasConfiguredClerkKeys() {
  return (
    hasConfiguredKey(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) &&
    hasConfiguredKey(process.env.CLERK_SECRET_KEY)
  )
}
