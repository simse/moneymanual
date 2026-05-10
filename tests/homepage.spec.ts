import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/MoneyManual.org.uk/);
});

test("to show navbar", async ({ page }) => {
  await page.goto("/");

  const navbar = page.getByRole("navigation");

  await expect(navbar).toBeVisible();
});
