import { clerkAppearance } from "@/lib/clerk/appearance";
import { ClerkProvider as ClerkProviderBase } from "@clerk/nextjs";

export function ClerkProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProviderBase appearance={clerkAppearance}>
      {children}
    </ClerkProviderBase>
  );
}
