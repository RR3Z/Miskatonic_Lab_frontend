import { expect, test } from "@playwright/test"

const viewports = [
  { height: 844, kind: "mobile", width: 390 },
  { height: 1024, kind: "tablet", width: 768 },
  { height: 900, kind: "desktop", width: 1440 },
] as const

for (const viewport of viewports) {
  test(`renders the landing shell on ${viewport.kind}`, async ({ page }) => {
    await page.setViewportSize(viewport)
    await page.goto("/")

    await expect(
      page.getByRole("heading", { name: /miskatonic lab/i }),
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: /открыть архив/i }),
    ).toBeVisible()
    await expect(
      page.getByRole("button", { name: /создать сыщика/i }),
    ).toBeVisible()
    await expect(page.getByTestId("landing-radial-background")).toBeAttached()
    await expect(
      page.getByRole("heading", { name: /to get started/i }),
    ).toHaveCount(0)

    // Next can finish navigation before the client responsive providers hydrate.
    await page.waitForTimeout(300)
    await page
      .getByRole("button", { name: "Переключить боковую панель" })
      .click()

    if (viewport.kind === "mobile") {
      await expect(page.getByRole("dialog")).toBeVisible()
      await expect(
        page.getByRole("heading", { name: "Навигация" }),
      ).toBeAttached()
      return
    }

    await expect(page.getByRole("dialog")).toHaveCount(0)
    await expect(
      page.locator('[data-slot="sidebar"][data-state="expanded"]'),
    ).toBeVisible()
  })
}
