import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs"
import { clerkAppearance } from "@/lib/clerk/appearance"

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderBase appearance={clerkAppearance}>
      {children}
    </ClerkProviderBase>
  )
}
