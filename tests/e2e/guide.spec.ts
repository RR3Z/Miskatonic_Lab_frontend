import { expect, test } from "@playwright/test"

test("opens the guide, searches a block, and reaches its highlighted article section", async ({
  page,
}) => {
  await page.setViewportSize({ height: 900, width: 1440 })
  await page.goto("/guide")

  await expect(
    page.getByRole("heading", { level: 1, name: "Справочник сыщика" }),
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Создание сыщика" }).first(),
  ).toBeVisible()
  await expect(
    page.getByRole("link", { name: "Проверки и удача" }).first(),
  ).toBeVisible()

  const search = page.getByRole("textbox", { name: "Поиск по справочнику" })
  await search.click()
  await search.pressSequentially("кредитный рейтинг")

  const result = page.locator("#guide-search-results").getByRole("link", {
    name: /Средства, имущество и контакты/i,
  })
  await expect(result).toBeVisible()
  await result.click()

  await expect(page).toHaveURL(
    /\/guide\/creation\?match=finances-and-contacts&q=.*#finances-and-contacts/,
  )
  await expect(page.locator("#finances-and-contacts")).toBeInViewport()
})

test("keeps nested catalogue links full-width, highlighted, and independently scrollable", async ({
  page,
}) => {
  await page.setViewportSize({ height: 700, width: 1440 })
  await page.goto("/guide")

  const sidebar = page.locator('[data-slot="sidebar-content"]')
  const nestedLink = page.getByRole("link", {
    name: "Порядок создания",
  })
  const sidebarBox = await sidebar.boundingBox()
  const linkBox = await nestedLink.boundingBox()

  if (!sidebarBox || !linkBox) {
    throw new Error("Guide catalogue must have measurable bounds")
  }

  expect(linkBox.x + linkBox.width).toBeGreaterThan(
    sidebarBox.x + sidebarBox.width - 20,
  )

  const idleColor = await nestedLink.evaluate(
    (element) => getComputedStyle(element).backgroundColor,
  )
  await nestedLink.hover({ position: { x: linkBox.width - 3, y: 8 } })
  await expect
    .poll(() =>
      nestedLink.evaluate(
        (element) => getComputedStyle(element).backgroundColor,
      ),
    )
    .not.toBe(idleColor)

  const initialCatalogueScroll = await sidebar.evaluate(
    (element) => element.scrollTop,
  )
  await page.mouse.wheel(0, 500)
  await expect
    .poll(() => sidebar.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(initialCatalogueScroll)
  await expect
    .poll(() => page.evaluate(() => document.documentElement.scrollTop))
    .toBe(0)
})

test("opens the catalogue as a mobile sheet and closes it after selecting a block", async ({
  page,
}) => {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto("/guide")
  await page.waitForTimeout(300)

  const trigger = page.getByRole("button", { name: "Открыть каталог" })
  await expect(trigger).toBeVisible()
  await trigger.click()

  await expect(page.getByRole("dialog")).toBeVisible()
  await page.getByRole("link", { name: "Порядок создания" }).click()

  await expect(page.getByRole("dialog")).toHaveCount(0)
  await expect(page).toHaveURL("/guide/creation#creation-order")
})
