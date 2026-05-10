import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/tools/take-home-pay");
  await expect(
    page.getByRole("heading", { name: "Take-Home Pay Calculator" }),
  ).toBeVisible();
});

test("renders empty placeholder when no salary entered", async ({ page }) => {
  await expect(page.getByTestId("regular-month-figure")).toHaveText(
    "£- monthly",
  );
  await expect(page.getByTestId("bonus-month-card")).toHaveCount(0);
});

test("calculates take-home for £45k annual salary in 2026/27 (England)", async ({
  page,
}) => {
  await page.getByLabel("Gross salary").fill("45000");

  await expect(page.getByTestId("regular-month-figure")).toHaveText(
    "£2,993 monthly",
  );
  await expect(page.getByTestId("regular-annual-figure")).toHaveText(
    "£35,921 annually",
  );
  await expect(page.getByTestId("bonus-month-card")).toHaveCount(0);
});

test("changing tax year updates the result (Scotland)", async ({ page }) => {
  await page.getByLabel("Country").selectOption("Scotland");
  await page.getByLabel("Gross salary").fill("45000");

  await page.getByLabel("Tax year").selectOption("2024/25");
  const before = await page.getByTestId("regular-month-figure").textContent();

  await page.getByLabel("Tax year").selectOption("2026/27");
  const after = await page.getByTestId("regular-month-figure").textContent();

  expect(before).not.toBe(after);
});

test("net pay yields higher take-home than relief at source for higher-rate earner", async ({
  page,
}) => {
  await page.getByLabel("Gross salary").fill("60000");
  await page.locator("summary").filter({ hasText: "Pension contribution" }).click();
  await page.getByLabel("Pension contribution").fill("5");

  await page.getByLabel("Net pay arrangement").check();
  const netPay = await page
    .getByTestId("regular-annual-figure")
    .textContent();

  await page.getByLabel("Relief at source").check();
  const ras = await page.getByTestId("regular-annual-figure").textContent();

  const toNumber = (t: string | null) =>
    Number((t ?? "").replace(/[^0-9]/g, ""));
  expect(toNumber(netPay)).toBeGreaterThan(toNumber(ras));
});

test("annual bonus shows separate bonus month figure", async ({ page }) => {
  await page.getByLabel("Gross salary").fill("40000");
  await page.locator("summary").filter({ hasText: "Annual bonus" }).click();
  await page.getByLabel("Annual bonus").fill("5000");

  await expect(page.getByTestId("bonus-month-card")).toBeVisible();

  const regularText = await page
    .getByTestId("regular-month-figure")
    .textContent();
  const bonusText = await page
    .getByTestId("bonus-month-figure")
    .textContent();

  const toNumber = (t: string | null) =>
    Number((t ?? "").replace(/[^0-9]/g, ""));
  const regular = toNumber(regularText);
  const bonus = toNumber(bonusText);
  expect(bonus).toBeGreaterThan(regular);

  // Net bonus on £5,000 for a basic-rate taxpayer is roughly £3,600
  // (20% income tax + 8% NI = 28% deducted). Allow a £200 tolerance.
  expect(bonus - regular).toBeGreaterThan(3400);
  expect(bonus - regular).toBeLessThan(3800);
});
