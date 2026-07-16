import { readdirSync, readFileSync } from "node:fs"
import { join, relative, resolve } from "node:path"
import { describe, expect, it } from "vitest"

const componentsDirectory = resolve(process.cwd(), "src/components")
const nativeControlPattern = /<(?:input|textarea|select)\b/
const allowedNativeControlFiles = new Set(["ui/input.tsx", "ui/textarea.tsx"])

function componentFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return componentFiles(path)
    return entry.name.endsWith(".tsx") ? [path] : []
  })
}

describe("UI component policy", () => {
  it("keeps native text controls inside shared UI primitives", () => {
    const violations = componentFiles(componentsDirectory)
      .filter((path) => nativeControlPattern.test(readFileSync(path, "utf8")))
      .map((path) => relative(componentsDirectory, path).replaceAll("\\", "/"))
      .filter((path) => !allowedNativeControlFiles.has(path))

    expect(violations).toEqual([])
  })
})
