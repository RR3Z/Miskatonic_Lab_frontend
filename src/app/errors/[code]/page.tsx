import Link from "next/link"
import { GuideSymbol } from "@/components/guide/symbol/guide-symbol"
import localizedContent from "@/data/locales/ru/errors/pages.ru.json"
import { getPresentedError } from "@/lib/errors/catalog"
import { appRoutes } from "@/lib/routes/app-routes"

type ErrorDocumentationPageProps = {
  params: Promise<{ code: string }>
}

export default async function ErrorDocumentationPage({
  params,
}: ErrorDocumentationPageProps) {
  const { code } = await params
  const entry = getPresentedError(code)

  return (
    <main className="flex min-h-full flex-1 flex-col bg-(--ml-bg-page) text-(--ml-ink-primary)">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8 sm:py-10">
        <header className="relative isolate overflow-hidden border border-(--ml-border-aged) bg-(--ml-surface-panel) px-5 py-9 shadow-[0_18px_60px_rgba(0,0,0,0.24)] sm:px-8 sm:py-12">
          <GuideSymbol
            alt=""
            className="pointer-events-none absolute inset-0 size-full max-w-none object-cover opacity-35"
            priority
            symbol="occult"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--ml-surface-panel)_0%,rgba(30,26,23,0.9)_48%,rgba(30,26,23,0.48)_100%)]" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <Link
              className="text-sm text-(--ml-accent-brass-strong) hover:underline"
              href={appRoutes.errors}
            >
              {localizedContent.copy.appErrorsCodePage.dokumentatsiyaOshibok}
            </Link>
            <code className="block text-xs text-(--ml-accent-brass-strong)">
              {entry.code}
            </code>
            <h1 className="font-(family-name:--font-display) text-4xl leading-none font-semibold text-(--ml-surface-paper) sm:text-6xl">
              {entry.title}
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-(--ml-ink-muted) sm:text-lg">
              {entry.documentation.summary}
            </p>
          </div>
        </header>

        <section
          className="mt-6 space-y-5"
          aria-labelledby="error-cases-heading"
        >
          <h2
            className="font-(family-name:--font-display) text-3xl font-semibold"
            id="error-cases-heading"
          >
            {localizedContent.copy.appErrorsCodePage.pochemuEtoMogloProizoiti}
          </h2>
          {entry.documentation.cases.map((errorCase, index) => (
            <article
              className="space-y-4 border border-(--ml-border-subtle) bg-(--ml-surface-panel) p-5 sm:p-6"
              key={`${errorCase.situation}-${index}`}
            >
              <h3 className="font-(family-name:--font-display) text-2xl font-semibold">
                {errorCase.situation}
              </h3>
              <p className="leading-relaxed text-(--ml-ink-secondary)">
                <span className="mr-1 font-semibold text-(--ml-ink-primary)">
                  {localizedContent.copy.appErrorsCodePage.pochemu}
                </span>
                {errorCase.why}
              </p>
              <ol className="list-decimal space-y-2 pl-5 text-(--ml-ink-secondary)">
                {errorCase.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </article>
          ))}
        </section>

        <aside className="mt-6 border border-(--ml-border-aged) bg-(--ml-surface-panel-raised) p-5 text-(--ml-ink-secondary) sm:p-6">
          {entry.documentation.supportHint}
        </aside>
      </div>
    </main>
  )
}
