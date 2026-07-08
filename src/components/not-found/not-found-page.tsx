import { LandingBackground } from "@/components/landing/landing-background";

export function NotFoundPage() {
  return (
    <main className="relative flex h-svh min-h-0 flex-col overflow-hidden bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <LandingBackground />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-center px-4 py-8 text-center">
        <h1 className="font-heading text-[6rem] leading-none tracking-tight text-(--ml-accent-danger) drop-shadow-[0_0_14px_rgba(139,33,31,0.5)] sm:text-[10rem]">
          404
        </h1>
        <p className="mt-1 font-heading text-2xl text-(--ml-ink-primary) sm:mt-2 sm:text-4xl">
          Страница не найдена
        </p>
        <p className="mx-auto mt-3 max-w-2xl font-body text-sm leading-relaxed text-(--ml-ink-muted) sm:mt-4 sm:text-base">
          Страница, которую вы ищете, не найдена в архивах Лаборатории
          Мискатоника.
          <br />
          Возможно, она была поглощена Бездной или никогда не существовала.
        </p>
      </div>
    </main>
  );
}
