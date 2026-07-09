import { ruRU } from "@clerk/localizations"
import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs"
import { ui } from "@clerk/ui"
import { clerkAppearance } from "@/lib/clerk/appearance"

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderBase
      appearance={clerkAppearance}
      localization={ruRU}
      prefetchUI={false}
      ui={ui}
    >
      {children}
    </ClerkProviderBase>
  )
}
