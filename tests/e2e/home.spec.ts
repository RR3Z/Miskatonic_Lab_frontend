import { expect, test } from "@playwright/test"

test("renders the landing page", async ({ page }) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", { name: /miskatonic lab/i }),
  ).toBeVisible()
  await expect(page.getByRole("button", { name: /войти/i })).toBeVisible()
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
})
