import { House } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { LandingBackground } from "@/components/landing/landing-background"
import { Button } from "@/components/ui/button"
import localizedContent from "@/data/locales/ru/common/common.ru.json"
import { appRoutes } from "@/lib/routes/app-routes"
import cthulhu from "../../../assets/symbols/esoteric/cthulhu.svg"

export function NotFoundPage() {
  return (
    <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <LandingBackground />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-8 text-center">
        <Image
          alt=""
          src={cthulhu}
          className="pointer-events-none absolute size-80 select-none opacity-[0.04] sm:size-[28rem]"
        />
        <h1 className="font-heading text-[6rem] leading-none tracking-tight text-(--ml-accent-danger) drop-shadow-[0_0_14px_rgba(139,33,31,0.5)] sm:text-[10rem]">
          {localizedContent.copy.componentsNotFoundNotFoundPage.code}
        </h1>
        <p className="mt-1 font-heading text-2xl text-(--ml-ink-primary) sm:mt-2 sm:text-4xl">
          {
            localizedContent.copy.componentsNotFoundNotFoundPage
              .stranitsaNeNaidena
          }
        </p>
        <p className="mx-auto mt-3 max-w-2xl font-body text-sm leading-relaxed text-(--ml-ink-muted) sm:mt-4 sm:text-base">
          {
            localizedContent.copy.componentsNotFoundNotFoundPage
              .stranitsaKotoruyuVyIscheteNeNaidena
          }
          <br />
          {
            localizedContent.copy.componentsNotFoundNotFoundPage
              .vozmozhnoOnaBylaPogloschenaBezdnoiIli
          }
        </p>
        <Button asChild className="mt-6 sm:mt-8" size="lg">
          <Link href={appRoutes.home}>
            <House aria-hidden="true" />
            {
              localizedContent.copy.componentsNotFoundNotFoundPage
                .vernutsyaVArhiv
            }
          </Link>
        </Button>
      </div>
    </main>
  )
}
