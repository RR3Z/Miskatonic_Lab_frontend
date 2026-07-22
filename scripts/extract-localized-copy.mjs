import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { dirname, relative, resolve, sep } from "node:path"
import ts from "typescript"

const root = resolve(import.meta.dirname, "..")
const srcRoot = resolve(root, "src")
const shouldWrite = process.argv.includes("--write")
const cyrillicPattern = /[А-Яа-яЁё]/

const transliteration = {
  а: "a",
  б: "b",
  в: "v",
  г: "g",
  д: "d",
  е: "e",
  ё: "e",
  ж: "zh",
  з: "z",
  и: "i",
  й: "i",
  к: "k",
  л: "l",
  м: "m",
  н: "n",
  о: "o",
  п: "p",
  р: "r",
  с: "s",
  т: "t",
  у: "u",
  ф: "f",
  х: "h",
  ц: "ts",
  ч: "ch",
  ш: "sh",
  щ: "sch",
  ъ: "",
  ы: "y",
  ь: "",
  э: "e",
  ю: "yu",
  я: "ya",
}

function walk(directory) {
  return ts.sys.readDirectory(directory, [".ts", ".tsx"], undefined, undefined)
}

function localeFor(file) {
  const path = relative(srcRoot, file).replaceAll(sep, "/")
  if (
    path.startsWith("components/character/create/") ||
    path.endsWith("dto/character/create-character.dto.ts")
  )
    return "character/create.ru.json"
  if (
    /^components\/character\/(list\/|delete\/|character-(?:card|card-actions|list-page))/.test(
      path,
    )
  )
    return "character/list.ru.json"
  if (
    path.includes("character/") ||
    path.startsWith("lib/dice/") ||
    path.startsWith("dto/character/")
  )
    return "character/detail.ru.json"
  if (path.startsWith("components/ui/")) return "common/ui.ru.json"
  if (path.startsWith("components/layout/") || path === "app/layout.tsx")
    return "layout/layout.ru.json"
  if (path.startsWith("components/errors/") || path.startsWith("app/errors/"))
    return "errors/pages.ru.json"
  if (path.startsWith("components/guide/")) return "guide/guide.ru.json"
  if (path.startsWith("components/landing/")) return "landing/landing.ru.json"
  if (path.startsWith("components/effects/")) return "common/effects.ru.json"
  return "common/common.ru.json"
}

function camel(value) {
  const words = value.split(/[^A-Za-z0-9]+/).filter(Boolean)
  return (
    words
      .map((word, index) =>
        index === 0
          ? word.charAt(0).toLowerCase() + word.slice(1)
          : word.charAt(0).toUpperCase() + word.slice(1),
      )
      .join("") || "copy"
  )
}

function keyFor(text) {
  const ascii = [...text.toLowerCase()]
    .map(
      (character) =>
        transliteration[character] ??
        (/[a-z0-9]/.test(character) ? character : " "),
    )
    .join("")
  const key = camel(ascii.split(/\s+/).filter(Boolean).slice(0, 6).join("-"))
  return /^[0-9]/.test(key) ? `copy${key}` : key
}

function fileKey(file) {
  const parts = relative(srcRoot, file)
    .replaceAll(sep, "/")
    .replace(/\.[^.]+$/, "")
    .split("/")
    .slice(-4)
  return camel(parts.join("-"))
}

function readCatalog(path) {
  try {
    return JSON.parse(readFileSync(path, "utf8"))
  } catch (error) {
    if (error?.code === "ENOENT") return {}
    throw error
  }
}

const catalogCache = new Map()
const changedCatalogs = new Set()
let changedFiles = 0
let extractedStrings = 0

function catalogEntry(localePath, sourceFile, value) {
  const absolutePath = resolve(srcRoot, "data/locales/ru", localePath)
  const catalog = catalogCache.get(absolutePath) ?? readCatalog(absolutePath)
  catalog.copy ??= {}
  const section = fileKey(sourceFile)
  catalog.copy[section] ??= {}

  const existing = Object.entries(catalog.copy[section]).find(
    ([, text]) => text === value,
  )
  if (existing) {
    catalogCache.set(absolutePath, catalog)
    return { absolutePath, section, key: existing[0] }
  }

  const baseKey = keyFor(value)
  let key = baseKey
  let suffix = 2
  while (key in catalog.copy[section] && catalog.copy[section][key] !== value) {
    key = `${baseKey}${suffix}`
    suffix += 1
  }
  catalog.copy[section][key] = value
  catalogCache.set(absolutePath, catalog)
  changedCatalogs.add(absolutePath)
  return { absolutePath, section, key }
}

function expressionFor(entry) {
  return `localizedContent.copy.${entry.section}.${entry.key}`
}

for (const file of walk(srcRoot)) {
  if (file.includes(`${sep}data${sep}locales${sep}`)) continue
  const source = readFileSync(file, "utf8")
  if (!cyrillicPattern.test(source)) continue

  const sourceFile = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
  const localePath = localeFor(file)
  const replacements = []
  let needsTemplateFormatter = false

  function replaceLiteral(node, value, jsxAttribute = false) {
    if (!cyrillicPattern.test(value)) return
    const entry = catalogEntry(localePath, file, value)
    const expression = expressionFor(entry)
    const parent = node.parent
    let replacement = expression

    if (jsxAttribute) replacement = `{${expression}}`
    else if (
      (ts.isPropertyAssignment(parent) || ts.isMethodDeclaration(parent)) &&
      parent.name === node
    )
      replacement = `[${expression}]`

    replacements.push({
      start: node.getStart(sourceFile),
      end: node.getEnd(),
      replacement,
    })
    extractedStrings += 1
  }

  function visit(node) {
    if (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) return

    if (
      ts.isTemplateExpression(node) &&
      cyrillicPattern.test(node.getText(sourceFile))
    ) {
      let template = node.head.text
      const values = []
      node.templateSpans.forEach((span, index) => {
        const key = `value${index}`
        template += `{${key}}${span.literal.text}`
        values.push(`${key}: ${span.expression.getText(sourceFile)}`)
      })
      const entry = catalogEntry(localePath, file, template)
      replacements.push({
        start: node.getStart(sourceFile),
        end: node.getEnd(),
        replacement: `formatLocalizedTemplate(${expressionFor(entry)}, { ${values.join(", ")} })`,
      })
      needsTemplateFormatter = true
      extractedStrings += 1
      return
    }

    if (ts.isJsxText(node) && cyrillicPattern.test(node.text)) {
      const value = node.text.trim()
      if (value) {
        const entry = catalogEntry(localePath, file, value)
        replacements.push({
          start: node.getStart(sourceFile),
          end: node.getEnd(),
          replacement: `{${expressionFor(entry)}}`,
        })
        extractedStrings += 1
      }
      return
    }

    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
      const jsxAttribute = ts.isJsxAttribute(node.parent)
      replaceLiteral(node, node.text, jsxAttribute)
      return
    }

    ts.forEachChild(node, visit)
  }

  visit(sourceFile)
  if (replacements.length === 0) continue

  const localeImport = `@/data/locales/ru/${localePath}`
  const importLines = [`import localizedContent from "${localeImport}"`]
  if (needsTemplateFormatter) {
    importLines.push(
      'import { formatLocalizedTemplate } from "@/data/locales/utils/format-localized-template.util"',
    )
  }

  let output = source
  for (const replacement of replacements.sort((a, b) => b.start - a.start)) {
    output =
      output.slice(0, replacement.start) +
      replacement.replacement +
      output.slice(replacement.end)
  }

  const directives = sourceFile.statements.filter(
    (statement) =>
      ts.isExpressionStatement(statement) &&
      ts.isStringLiteral(statement.expression),
  )
  const insertAt = directives.length > 0 ? directives.at(-1).getEnd() : 0
  output = `${output.slice(0, insertAt)}${insertAt ? "\n\n" : ""}${importLines.join("\n")}\n${output.slice(insertAt)}`

  if (shouldWrite) writeFileSync(file, output, "utf8")
  changedFiles += 1
}

if (shouldWrite) {
  for (const [path, catalog] of catalogCache) {
    if (!changedCatalogs.has(path)) continue
    mkdirSync(dirname(path), { recursive: true })
    writeFileSync(path, `${JSON.stringify(catalog, null, 2)}\n`, "utf8")
  }
}

console.log(
  `${shouldWrite ? "Extracted" : "Would extract"} ${extractedStrings} strings from ${changedFiles} files into ${changedCatalogs.size} catalogs`,
)
