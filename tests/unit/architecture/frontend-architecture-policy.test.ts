import { existsSync, readdirSync, readFileSync } from "node:fs"
import { dirname, extname, join, relative, resolve } from "node:path"
import ts from "typescript"
import { describe, expect, it } from "vitest"

const sourceRoot = resolve(process.cwd(), "src")
const sourceFiles = filesIn(sourceRoot).filter((path) => /\.tsx?$/.test(path))

function filesIn(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    return entry.isDirectory() ? filesIn(path) : [path]
  })
}

function sourceFile(path: string) {
  return ts.createSourceFile(
    path,
    readFileSync(path, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
}

function projectPath(path: string) {
  return relative(sourceRoot, path).replaceAll("\\", "/")
}

function isExported(
  node: ts.Node & { modifiers?: ts.NodeArray<ts.ModifierLike> },
) {
  return node.modifiers?.some(
    (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
  )
}

function containsJsx(node: ts.Node): boolean {
  if (
    ts.isJsxElement(node) ||
    ts.isJsxSelfClosingElement(node) ||
    ts.isJsxFragment(node)
  ) {
    return true
  }
  return node.getChildren().some(containsJsx)
}

function topLevelComponents(parsed: ts.SourceFile): string[] {
  return parsed.statements.flatMap((statement) => {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      /^[A-Z]/.test(statement.name.text) &&
      statement.body &&
      containsJsx(statement.body)
    ) {
      return [statement.name.text]
    }
    if (!ts.isVariableStatement(statement)) return []
    return statement.declarationList.declarations.flatMap((declaration) => {
      if (
        !ts.isIdentifier(declaration.name) ||
        !/^[A-Z]/.test(declaration.name.text)
      )
        return []
      return declaration.initializer && containsJsx(declaration.initializer)
        ? [declaration.name.text]
        : []
    })
  })
}

function exportedHooks(parsed: ts.SourceFile): string[] {
  return parsed.statements.flatMap((statement) => {
    if (
      ts.isFunctionDeclaration(statement) &&
      statement.name &&
      /^use[A-Z0-9]/.test(statement.name.text) &&
      isExported(statement)
    ) {
      return [statement.name.text]
    }
    if (!ts.isVariableStatement(statement) || !isExported(statement)) return []
    return statement.declarationList.declarations.flatMap((declaration) =>
      ts.isIdentifier(declaration.name) &&
      /^use[A-Z0-9]/.test(declaration.name.text)
        ? [declaration.name.text]
        : [],
    )
  })
}

function resolveSourceImport(from: string, specifier: string): string | null {
  const base = specifier.startsWith("@/")
    ? resolve(sourceRoot, specifier.slice(2))
    : specifier.startsWith(".")
      ? resolve(dirname(from), specifier)
      : null
  if (!base) return null
  for (const candidate of [base, `${base}.ts`, `${base}.tsx`]) {
    if (existsSync(candidate) && extname(candidate)) return candidate
  }
  return null
}

describe("frontend architecture policy", () => {
  it("uses no barrel entrypoints", () => {
    expect(
      sourceFiles
        .map(projectPath)
        .filter((path) => /(^|\/)index\.tsx?$/.test(path)),
    ).toEqual([])
  })

  it("keeps one React component and one exported hook per file", () => {
    const componentViolations = sourceFiles
      .filter(
        (path) =>
          projectPath(path).startsWith("components/") && path.endsWith(".tsx"),
      )
      .map((path) => ({
        path: projectPath(path),
        names: topLevelComponents(sourceFile(path)),
      }))
      .filter(({ names }) => names.length > 1)
    const hookViolations = sourceFiles
      .map((path) => ({
        path: projectPath(path),
        names: exportedHooks(sourceFile(path)),
      }))
      .filter(({ names }) => names.length > 1)

    expect(componentViolations).toEqual([])
    expect(hookViolations).toEqual([])
  })

  it("keeps hooks and support files in correctly named folders", () => {
    const violations: string[] = []
    for (const path of sourceFiles) {
      const project = projectPath(path)
      const hooks = exportedHooks(sourceFile(path))
      if (hooks.length > 0 && !project.startsWith("hooks/"))
        violations.push(project)

      const segments = project.split("/")
      const parent = segments.at(-2)
      const fileName = segments.at(-1) ?? ""
      const suffix = {
        constants: ".constants.ts",
        styles: ".styles.ts",
        types: ".types.ts",
        utils: ".util.ts",
      }[parent ?? ""]
      if (
        suffix &&
        !fileName.endsWith(suffix) &&
        !fileName.endsWith(`${suffix}x`)
      )
        violations.push(project)
    }
    expect(violations).toEqual([])
  })

  it("uses native controls only inside shared UI primitives", () => {
    const allowed = new Set([
      "components/ui/button.tsx",
      "components/ui/checkbox.tsx",
      "components/ui/input.tsx",
      "components/ui/textarea.tsx",
    ])
    const violations: string[] = []
    for (const path of sourceFiles.filter((file) => file.endsWith(".tsx"))) {
      const parsed = sourceFile(path)
      function visit(node: ts.Node) {
        if (
          (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) &&
          ts.isIdentifier(node.tagName) &&
          ["button", "input", "select", "textarea"].includes(
            node.tagName.text,
          ) &&
          !allowed.has(projectPath(path))
        ) {
          violations.push(
            `${projectPath(path)}:${parsed.getLineAndCharacterOfPosition(node.getStart()).line + 1}`,
          )
        }
        ts.forEachChild(node, visit)
      }
      visit(parsed)
    }
    expect(violations).toEqual([])
  })

  it("keeps user-facing copy in UTF-8 JSON catalogs", () => {
    const violations: string[] = []
    for (const path of sourceFiles) {
      const source = readFileSync(path, "utf8")
      if (/[А-Яа-яЁё]/.test(source))
        violations.push(`${projectPath(path)}: Cyrillic literal`)
      if (/\uFFFD|Ã.|Â.|вЂ/.test(source))
        violations.push(`${projectPath(path)}: mojibake`)

      const parsed = sourceFile(path)
      function visit(node: ts.Node) {
        if (ts.isJsxText(node) && /[\p{L}\p{N}]/u.test(node.text)) {
          violations.push(
            `${projectPath(path)}: JSX text ${JSON.stringify(node.text.trim())}`,
          )
        }
        if (
          ts.isJsxExpression(node) &&
          node.expression &&
          (ts.isStringLiteral(node.expression) ||
            ts.isNoSubstitutionTemplateLiteral(node.expression))
        ) {
          violations.push(`${projectPath(path)}: string-only JSX expression`)
        }
        if (
          ts.isJsxAttribute(node) &&
          ts.isIdentifier(node.name) &&
          ["alt", "aria-label", "placeholder", "title"].includes(
            node.name.text,
          ) &&
          node.initializer &&
          ts.isStringLiteral(node.initializer) &&
          node.initializer.text !== ""
        ) {
          violations.push(`${projectPath(path)}: literal ${node.name.text}`)
        }
        ts.forEachChild(node, visit)
      }
      visit(parsed)
    }
    expect(violations).toEqual([])
  })

  it("keeps lower layers independent from components", () => {
    const violations: string[] = []
    for (const path of sourceFiles) {
      const project = projectPath(path)
      const isLowerLayer = /^(data|dto|hooks|lib|stores|types)\//.test(project)
      const isRoute = project.startsWith("app/")
      for (const statement of sourceFile(path).statements) {
        if (
          !ts.isImportDeclaration(statement) ||
          !ts.isStringLiteral(statement.moduleSpecifier)
        )
          continue
        const specifier = statement.moduleSpecifier.text
        if (isLowerLayer && specifier.startsWith("@/components/"))
          violations.push(`${project} -> ${specifier}`)
        if (
          isRoute &&
          specifier.startsWith("@/components/") &&
          specifier.includes("/utils/")
        )
          violations.push(`${project} -> ${specifier}`)
      }
    }
    expect(violations).toEqual([])
  })

  it("has no source import cycles", () => {
    const graph = new Map<string, string[]>()
    for (const path of sourceFiles) {
      graph.set(
        path,
        sourceFile(path).statements.flatMap((statement) => {
          if (
            !ts.isImportDeclaration(statement) ||
            !ts.isStringLiteral(statement.moduleSpecifier)
          )
            return []
          const resolved = resolveSourceImport(
            path,
            statement.moduleSpecifier.text,
          )
          return resolved ? [resolved] : []
        }),
      )
    }

    const visited = new Set<string>()
    const active = new Set<string>()
    const cycles: string[] = []
    function visit(path: string, stack: string[]) {
      if (active.has(path)) {
        const start = stack.indexOf(path)
        cycles.push([...stack.slice(start), path].map(projectPath).join(" -> "))
        return
      }
      if (visited.has(path)) return
      visited.add(path)
      active.add(path)
      for (const dependency of graph.get(path) ?? [])
        visit(dependency, [...stack, path])
      active.delete(path)
    }
    for (const path of sourceFiles) visit(path, [])
    expect([...new Set(cycles)]).toEqual([])
  })

  it("stores every source file as valid UTF-8", () => {
    const decoder = new TextDecoder("utf-8", { fatal: true })
    const violations = filesIn(sourceRoot).flatMap((path) => {
      try {
        decoder.decode(readFileSync(path))
        return []
      } catch {
        return [projectPath(path)]
      }
    })
    expect(violations).toEqual([])
  })
})
