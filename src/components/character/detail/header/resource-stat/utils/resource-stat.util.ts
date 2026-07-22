import localizedContent from "@/data/locales/ru/character/detail.ru.json"
export function adjustDraftValue(
  setValue: (value: string) => void,
  value: number | null,
  delta: -1 | 1,
) {
  if (value !== null) setValue(String(value + delta))
}

export function parseResourceValue(value: string): number | null {
  if (!/^\d+$/.test(value)) return null
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed <= 100 ? parsed : null
}

export function getResourceValidationMessage(
  current: number | null,
  max: number | null,
): string | null {
  if (current === null || max === null)
    return localizedContent.copy.headerResourceStatUtilsResourceStatUtil
      .vvediteTseloeNeotritsatelnoeZnachenieOt0
  return current > max
    ? localizedContent.copy.headerResourceStatUtilsResourceStatUtil
        .tekuscheeZnachenieNeMozhetBytBolshe
    : null
}
