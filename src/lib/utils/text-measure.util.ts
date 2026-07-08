export function getMeasuredTexts(
  original: string,
  alternates: readonly string[],
) {
  return [original, ...alternates]
}

export function measureMaxTextWidth(
  texts: readonly string[],
  font: string,
): number {
  const el = document.createElement("span")
  el.style.position = "absolute"
  el.style.visibility = "hidden"
  el.style.whiteSpace = "nowrap"
  el.style.font = font
  document.body.appendChild(el)

  let max = 0
  for (const text of texts) {
    el.textContent = text
    max = Math.max(max, el.offsetWidth)
  }

  document.body.removeChild(el)
  return max
}
