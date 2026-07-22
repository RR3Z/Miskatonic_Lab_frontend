export function formatLocalizedTemplate(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{([A-Za-z][A-Za-z0-9]*)\}/g, (placeholder, key) =>
    key in values ? String(values[key]) : placeholder,
  )
}
