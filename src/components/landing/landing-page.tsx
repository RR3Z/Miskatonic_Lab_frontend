import { CaseFileCard } from "@/components/landing/case-file-card";
import { LandingBackground } from "@/components/landing/landing-background";
import { LandingFooter } from "@/components/landing/landing-footer";
import { LandingHeader } from "@/components/landing/landing-header";
import { LandingMarquee } from "@/components/landing/landing-marquee";

export function LandingPage() {
  return (
    <main className="relative flex h-svh min-h-0 flex-col overflow-hidden bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <LandingBackground />
      <LandingHeader />
      <div className="relative z-10 flex min-h-0 flex-1 items-center px-3 py-2 sm:px-4 sm:py-6">
        <CaseFileCard />
      </div>
      <LandingMarquee />
      <LandingFooter />
    </main>
  );
}
