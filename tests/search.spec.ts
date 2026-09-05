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

for (const locale of ["cy", "sco"]) {
  test(`${locale} search keeps locale and encodes suggestion queries`, async ({ page }) => {
    const phrase = "tax & savings+";
    await page.route(`**/${locale}/api/search-autocomplete?*`, async (route) => {
      expect(new URL(route.request().url()).searchParams.get("query")).toBe("tax &");
      await route.fulfill({ json: { results: [{ phrase, matchedTerms: ["tax"] }], provider: "minisearch" } });
    });
    await page.goto(`/${locale}/search`);
    const input = page.locator("input#search_query");
    await input.fill("tax &");
    const suggestion = page.locator("form ul li a").first();
    await expect(suggestion).toBeVisible();
    await expect(suggestion.locator("strong")).toHaveText("tax ");
    const href = await suggestion.getAttribute("href");
    const url = new URL(href ?? "", "https://example.com");
    expect(url.pathname).toBe(`/${locale}/search`);
    expect(url.searchParams.get("query")).toBe(phrase);
    await expect(page.locator("form").first()).toHaveAttribute("action", `/${locale}/search`);
  });
}

test("results page shows query timing when the provider supplies it", async ({ page, request }) => {
  const response = await request.get("/api/search?query=inflation");
  expect(response.ok()).toBeTruthy();
  const body = await response.json();
  expect(["typesense", "minisearch"]).toContain(body.provider);
  expect(Array.isArray(body.results)).toBeTruthy();
  await page.goto("/search?query=inflation");
  const summary = page.locator("main > p");
  if (body.queryTimeMs !== undefined) {
    await expect(summary).toHaveText(/^Found \d+ results for "inflation" in \d+(?:\.\d+)? ms$/);
  } else {
    await expect(summary).toHaveText(/^Found \d+ results for "inflation"$/);
  }
});
