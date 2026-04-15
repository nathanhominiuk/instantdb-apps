import { test, expect } from "@playwright/test";

test.describe("Date navigation", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("clicking Next changes the date title", async ({ page }) => {
    const title = page.getByTestId("nav-title");
    const initialTitle = await title.textContent();

    await page.getByTestId("nav-next").click();
    await page.waitForTimeout(500);

    const newTitle = await title.textContent();
    expect(newTitle).not.toBe(initialTitle);
  });

  test("clicking Prev changes the date title", async ({ page }) => {
    const title = page.getByTestId("nav-title");
    const initialTitle = await title.textContent();

    await page.getByTestId("nav-prev").click();
    await page.waitForTimeout(500);

    const newTitle = await title.textContent();
    expect(newTitle).not.toBe(initialTitle);
  });

  test("clicking Today resets to current date", async ({ page }) => {
    const title = page.getByTestId("nav-title");

    // Navigate away
    await page.getByTestId("nav-next").click();
    await page.getByTestId("nav-next").click();
    await page.waitForTimeout(500);
    const awayTitle = await title.textContent();

    // Go back to today
    await page.getByTestId("nav-today").click();
    await page.waitForTimeout(500);
    const todayTitle = await title.textContent();

    expect(todayTitle).not.toBe(awayTitle);
  });

  test("Next/Prev navigates by day in day view", async ({ page }) => {
    await page.getByTestId("view-day").click();
    const title = page.getByTestId("nav-title");
    const initialTitle = await title.textContent();

    await page.getByTestId("nav-next").click();
    await page.waitForTimeout(500);

    const nextTitle = await title.textContent();
    expect(nextTitle).not.toBe(initialTitle);
    // Title should be a full day name like "Wednesday, April 16, 2026"
    expect(nextTitle).toMatch(/\w+day/);
  });

  test("Next/Prev navigates by month in month view", async ({ page }) => {
    await page.getByTestId("view-month").click();
    const title = page.getByTestId("nav-title");
    const initialTitle = await title.textContent();

    await page.getByTestId("nav-next").click();
    await page.waitForTimeout(500);

    const nextTitle = await title.textContent();
    expect(nextTitle).not.toBe(initialTitle);
  });

  test("keyboard arrow keys navigate dates", async ({ page }) => {
    const title = page.getByTestId("nav-title");
    const initialTitle = await title.textContent();

    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(500);

    const nextTitle = await title.textContent();
    expect(nextTitle).not.toBe(initialTitle);

    await page.keyboard.press("ArrowLeft");
    await page.waitForTimeout(500);

    const backTitle = await title.textContent();
    expect(backTitle).toBe(initialTitle);
  });

  test("pressing T key goes to today", async ({ page }) => {
    // Navigate away first
    await page.getByTestId("nav-next").click();
    await page.getByTestId("nav-next").click();
    await page.waitForTimeout(500);

    const title = page.getByTestId("nav-title");
    const awayTitle = await title.textContent();

    await page.keyboard.press("t");
    await page.waitForTimeout(500);

    const todayTitle = await title.textContent();
    expect(todayTitle).not.toBe(awayTitle);
  });
});
