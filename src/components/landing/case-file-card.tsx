import Image from "next/image"
import { MadnessText } from "@/components/effects/madness-text/madness-text"
import { CloseStamp } from "@/components/landing/close-stamp"
import { LandingActions } from "@/components/landing/landing-actions"
import { landingContent } from "@/data/locales/utils/landing-content.util"
import badgeIcon from "../../../assets/symbols/black/nyarlathotep.svg"
import keeperStamp from "../../../assets/symbols/signature.svg"

export function CaseFileCard() {
  const { caseFile } = landingContent

  return (
    <section
      aria-labelledby="landing-case-title"
      className="relative mx-auto w-[min(94vw,46.5rem)] border border-[color-mix(in_srgb,var(--ml-border-aged)_82%,black)] bg-(--ml-surface-paper) px-4 pt-6 pb-4 text-(--ml-ink-on-paper) shadow-[7px_9px_0_rgba(0,0,0,0.38)] sm:px-7 sm:pt-8 sm:pb-6 sm:shadow-[10px_13px_0_rgba(0,0,0,0.38)]"
    >
      <div className="top-[-1.02rem] absolute left-6 z-10 flex h-[2.1rem] w-[9.55rem] items-center justify-center gap-1 rounded-t-[6px] border border-b-0 border-[color-mix(in_srgb,var(--ml-border-aged)_82%,black)] bg-(--ml-surface-paper-muted) font-heading text-[1.5rem] leading-none sm:left-7">
        <Image
          alt=""
          aria-hidden="true"
          className="block size-[1.55rem] shrink-0 object-contain"
          height={25}
          src={badgeIcon}
          width={25}
        />
        <span className="inline-flex items-center leading-none">
          {caseFile.registryCode}
        </span>
      </div>

      <CloseStamp
        aria-hidden="true"
        className="absolute top-4 right-4 z-10 h-auto w-25 rotate-3 opacity-90 sm:top-5 sm:right-6 sm:w-30"
      />

      <p className="relative z-10 pr-24 font-body text-[0.6rem] text-(--ml-ink-on-paper-muted) uppercase tracking-[0.22em] sm:pr-0 sm:text-[0.67rem] sm:tracking-[0.28em]">
        {caseFile.department}
      </p>
      <h1
        className="relative z-10 mt-3 font-heading text-[1.92rem] uppercase leading-[0.88] tracking-widest sm:mt-4 sm:text-[3.65rem] sm:tracking-[0.16em]"
        id="landing-case-title"
      >
        {caseFile.title}
      </h1>
      <p className="relative z-10 mt-3 max-w-xl font-body text-[0.6rem] text-(--ml-ink-on-paper-muted) uppercase leading-4 tracking-[0.12em] sm:mt-5 sm:text-[0.78rem] sm:leading-5 sm:tracking-[0.24em]">
        {caseFile.summary}
      </p>

      <dl className="relative z-10 mt-2 grid gap-x-6 gap-y-2 border-[color-mix(in_srgb,var(--ml-border-aged)_70%,transparent)] border-y py-2 sm:mt-3 sm:grid-cols-3 sm:gap-y-3 sm:py-3">
        {caseFile.meta.map((item) => (
          <div key={item.label}>
            <dt className="font-body text-[0.62rem] text-(--ml-ink-on-paper-muted) tracking-[0.14em] sm:text-[0.72rem] sm:tracking-[0.18em]">
              {item.label}
            </dt>
            <dd className="mt-0.5 font-heading font-semibold text-[0.96rem] leading-tight sm:mt-1 sm:text-[1.1rem]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="relative z-10 mt-3 sm:mt-4">
        <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.92fr)] gap-3 sm:grid-cols-[minmax(20.75rem,1fr)_minmax(0,20.5rem)] sm:gap-5">
          <div>
            <p className="font-body text-[0.72rem] text-(--ml-ink-on-paper-muted) tracking-[0.18em] sm:text-[1rem] sm:tracking-[0.22em]">
              {caseFile.investigatorsLabel}
            </p>
            <ul className="mt-1 space-y-0.5 font-heading font-semibold text-[0.92rem] leading-[1.08] sm:mt-1.5 sm:space-y-1 sm:text-[1.46rem]">
              {caseFile.investigators.map((investigator) => (
                <li key={investigator}>{investigator}</li>
              ))}
            </ul>
            <div className="mt-3 hidden sm:mt-6 sm:block">
              <LandingActions />
            </div>
          </div>

          <div className="relative sm:min-h-[10.4rem]">
            <p className="font-body text-[0.72rem] text-(--ml-ink-on-paper-muted) tracking-[0.18em] sm:text-[1rem] sm:tracking-[0.28em]">
              {caseFile.keeper.label}
            </p>
            <p className="mt-1 font-heading font-semibold text-[0.98rem] leading-tight sm:mt-2 sm:max-w-56 sm:text-[1.5rem]">
              {caseFile.keeper.name}
            </p>

            <div className="relative mt-1 hidden w-full sm:block sm:h-24 lg:h-[6.7rem]">
              <Image
                alt=""
                aria-hidden="true"
                className="absolute z-0 rotate-[-10deg] object-contain opacity-[0.9] mix-blend-multiply sm:-top-9 sm:right-[4.9rem] sm:size-[6rem] lg:-top-4 lg:right-[3.2rem] lg:size-[6.45rem]"
                height={200}
                src={keeperStamp}
                width={200}
              />
              <div className="absolute z-10 flex rotate-[-10deg] flex-col items-center gap-1 text-center sm:right-8 sm:-bottom-2 lg:right-12 lg:-bottom-3">
                <p className="whitespace-nowrap font-signature text-(--ml-ink-on-paper-muted) text-[0.9rem] uppercase leading-none tracking-[0.16em] lg:text-[1rem]">
                  <MadnessText>
                    {`${caseFile.keeper.location}, ${caseFile.keeper.date}`}
                  </MadnessText>
                </p>
              </div>
            </div>

            <div className="absolute top-9 right-0 z-10 flex flex-col items-center sm:hidden">
              <Image
                alt=""
                aria-hidden="true"
                className="size-[4.5rem] rotate-[-3deg] object-contain opacity-[0.9] mix-blend-multiply"
                height={200}
                src={keeperStamp}
                width={200}
              />
              <p className="whitespace-nowrap text-center font-signature text-[0.6rem] text-(--ml-ink-on-paper-muted) uppercase leading-none tracking-[0.1em] rotate-[-3deg]">
                <MadnessText>
                  {`${caseFile.keeper.location}, ${caseFile.keeper.date}`}
                </MadnessText>
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 sm:hidden">
          <LandingActions
            actionClassName="min-w-0 flex-1 px-2 text-[0.76rem]"
            className="grid w-full grid-cols-2 gap-2 mt-8"
          />
        </div>
      </div>
    </section>
  )
}
