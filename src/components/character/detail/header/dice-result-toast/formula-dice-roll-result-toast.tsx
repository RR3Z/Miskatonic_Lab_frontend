type FormulaDiceRollResultToastProps = {
  formula: string
  result: number
  title: string
}

export function FormulaDiceRollResultToast({
  formula,
  result,
  title,
}: FormulaDiceRollResultToastProps) {
  return (
    <div
      className="flex h-full w-full min-w-0 items-center gap-3"
      data-testid="formula-dice-roll-result"
    >
      <span className="grid size-14 shrink-0 place-items-center rounded-full border-2 border-[#b6a367] bg-transparent font-mono text-2xl font-bold tabular-nums text-[#ead99b]">
        {result}
      </span>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <strong className="whitespace-nowrap font-heading text-xl leading-none text-[#f4ead0]">
          {title}
        </strong>
        <span className="mt-1 whitespace-nowrap font-mono text-xs font-bold tracking-[0.16em] text-[#b7aa81]">
          {formula}
        </span>
      </div>
    </div>
  )
}
