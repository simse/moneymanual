import { expect, test } from "@playwright/test";

test("search results page renders matches for a known query", async ({
  page,
}) => {
  await page.goto("/search?query=inflation");

  await expect(
    page.getByRole("heading", { name: /Search on MoneyManual/ }),
  ).toBeVisible();
  await expect(page.getByText(/Found \d+ results for "inflation"/)).toBeVisible();

  const items = page.locator("main ul li");
  await expect(items.first()).toBeVisible();
  await expect(items.first().getByRole("link")).toHaveAttribute(
    "href",
    /^\//,
  );
});

test("autocomplete dropdown shows suggestions when typing", async ({
  page,
}) => {
  await page.goto("/search");

  await page.locator("input#search_query").pressSequentially("infla", {
    delay: 20,
  });

  const suggestion = page.locator("form ul li").first();
  await expect(suggestion).toBeVisible();
  await expect(suggestion).toContainText("inflation");
});

test("clicking a suggestion navigates to /search with that query", async ({
  page,
}) => {
  await page.goto("/search");

  await page.locator("input#search_query").pressSequentially("infla", {
    delay: 20,
  });

  const firstSuggestion = page.locator("form ul li a").first();
  await expect(firstSuggestion).toBeVisible();

  const href = await firstSuggestion.getAttribute("href");
  expect(href).toMatch(/^\/search\?query=/);

  await firstSuggestion.click();
  await expect(page).toHaveURL(/\/search\?query=/);
});

test("pressing Enter submits to /search with the typed query", async ({
  page,
}) => {
  await page.goto("/");

  await page
    .locator("input#search_query")
    .first()
    .pressSequentially("inflation", { delay: 10 });
  await page.locator("input#search_query").first().press("Enter");

  await expect(page).toHaveURL(/\/search\?query=inflation$/);
  await expect(page.getByText(/Found \d+ results for "inflation"/)).toBeVisible();
});

test("matched terms are wrapped in <strong> inside suggestions", async ({
  page,
}) => {
  await page.goto("/search");

  await page.locator("input#search_query").pressSequentially("infla", {
    delay: 20,
  });

  await expect(page.locator("form ul li").first()).toBeVisible();

  const strongs = page.locator("form ul li strong");
  await expect(strongs.first()).toBeVisible();
  await expect(strongs.first()).toHaveText(/inflation/i);
});
