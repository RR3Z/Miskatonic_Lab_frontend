import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const frontendRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const backendCatalogPath = resolve(
  process.env.MISKATONIC_BACKEND_ERROR_CATALOG ??
    resolve(
      frontendRoot,
      "../Miskatonic_Lab_backend/pkg/errors/error_catalog.json",
    ),
)
const frontendCatalogPath = resolve(
  frontendRoot,
  "src/data/locales/ru/errors/error-catalog.ru.json",
)

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"))
}

const backendCatalog = readJson(backendCatalogPath)
const frontendCatalog = readJson(frontendCatalogPath)
const backendCodes = new Set(Object.keys(backendCatalog.errors))
const frontendApiCodes = new Set(
  Object.entries(frontendCatalog.errors)
    .filter(([, entry]) => entry.kind === "api")
    .map(([code]) => code),
)

const missingCodes = [...backendCodes].filter(
  (code) => !frontendApiCodes.has(code),
)
const extraApiCodes = [...frontendApiCodes].filter(
  (code) => !backendCodes.has(code),
)
const invalidEntries = Object.entries(frontendCatalog.errors).flatMap(
  ([code, entry]) => {
    const template = frontendCatalog.templates[entry.template]
    if (!template) return [`${code}: unknown template ${entry.template}`]
    if (!entry.title?.trim()) return [`${code}: title is empty`]
    if (!template.toastSummary?.trim()) return [`${code}: summary is empty`]
    if (!template.action?.trim()) return [`${code}: action is empty`]
    if (entry.kind === "client" && !code.startsWith("client."))
      return [`${code}: client code must start with client.`]
    return []
  },
)

const violations = [
  ...missingCodes.map((code) => `missing frontend translation: ${code}`),
  ...extraApiCodes.map(
    (code) => `frontend API code is absent in backend: ${code}`,
  ),
  ...invalidEntries,
]

if (violations.length > 0) {
  throw new Error(`Error catalog contract failed:\n${violations.join("\n")}`)
}

console.log(`Error catalog contract OK: ${backendCodes.size} backend codes`)
