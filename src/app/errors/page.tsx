import { CircleHelp } from "lucide-react"
import Link from "next/link"

import { GuideSymbol } from "@/components/guide/symbol/guide-symbol"
import { getAllErrorCodes, getPresentedError } from "@/lib/errors/catalog"
import { appRoutes } from "@/lib/routes/app-routes"

export default function ErrorDocumentationIndexPage() {
  return (
    <main className="flex min-h-full flex-1 flex-col bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
        <header className="relative isolate min-h-72 overflow-hidden border border-(--ml-border-aged) bg-(--ml-surface-panel) px-5 py-9 shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:min-h-80 sm:px-8 sm:py-12">
          <GuideSymbol
            alt=""
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover opacity-55"
            priority
            symbol="occult"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--ml-surface-panel)_0%,rgba(30,26,23,0.92)_35%,rgba(30,26,23,0.4)_68%,rgba(30,26,23,0.22)_100%)]" />
          <div className="relative z-10 max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.2em] text-(--ml-accent-brass-strong) uppercase">
              Справочник приложения
            </p>
            <h1 className="mt-3 font-(family-name:--font-display) text-4xl leading-none font-semibold text-(--ml-surface-paper) sm:text-6xl">
              Документация ошибок
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-(--ml-ink-muted) sm:text-lg">
              Найдите код ошибки, узнайте возможные причины и безопасный способ
              исправления.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-(--ml-accent-brass-strong)">
              <CircleHelp aria-hidden="true" size={18} />
              {getAllErrorCodes().length} кодов в каталоге
            </div>
          </div>
        </header>

        <section
          className="mt-6 grid gap-4 md:grid-cols-2"
          aria-label="Коды ошибок"
        >
          {getAllErrorCodes().map((code) => {
            const error = getPresentedError(code)
            return (
              <Link
                className="group scroll-mt-6 border border-(--ml-border-subtle) bg-(--ml-surface-panel) p-5 transition-colors hover:border-(--ml-accent-brass-strong) hover:bg-(--ml-surface-panel-raised) sm:p-6"
                href={appRoutes.error(code)}
                id={code}
                key={code}
              >
                <code className="text-xs text-(--ml-accent-brass-strong)">
                  {code}
                </code>
                <h2 className="mt-3 font-(family-name:--font-display) text-2xl font-semibold text-(--ml-surface-paper)">
                  {error.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-(--ml-ink-muted)">
                  {error.toastSummary}
                </p>
              </Link>
            )
          })}
        </section>
      </div>
    </main>
  )
}
