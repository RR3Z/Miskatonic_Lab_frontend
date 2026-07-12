import { spawn } from "node:child_process"
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"

const command = process.argv[2]

if (command !== "dev" && command !== "start") {
  throw new Error('Expected Next.js command "dev" or "start"')
}

const envFile = readFileSync(new URL("../.env", import.meta.url), "utf8")
const portLine = envFile
  .split(/\r?\n/)
  .find((line) => /^\s*PORT\s*=/.test(line))
const port = portLine
  ?.split("=", 2)[1]
  ?.trim()
  .replace(/^['"]|['"]$/g, "")

if (!port || !/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535) {
  throw new Error("PORT in .env must be an integer from 1 to 65535")
}

const nextBin = fileURLToPath(
  new URL("../node_modules/next/dist/bin/next", import.meta.url),
)
const child = spawn(
  process.execPath,
  [nextBin, command, "--port", port, ...process.argv.slice(3)],
  { stdio: "inherit" },
)

child.on("exit", (code) => {
  process.exitCode = code ?? 1
})
