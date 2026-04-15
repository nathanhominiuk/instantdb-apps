import { test, expect } from "@playwright/test";

test.describe("Dark mode", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("app loads with dark mode by default", async ({ page }) => {
    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDarkClass).toBe(true);
  });

  test("switching to light mode removes dark class", async ({ page }) => {
    await page.getByTestId("settings-button").click();
    await page.getByTestId("settings-tab-appearance").click();
    await page.getByTestId("theme-light").click();
    await page.keyboard.press("Escape");

    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDarkClass).toBe(false);
  });

  test("switching back to dark mode restores dark class", async ({ page }) => {
    // Switch to light first
    await page.getByTestId("settings-button").click();
    await page.getByTestId("settings-tab-appearance").click();
    await page.getByTestId("theme-light").click();
    // Then back to dark
    await page.getByTestId("theme-dark").click();
    await page.keyboard.press("Escape");

    const hasDarkClass = await page.evaluate(() =>
      document.documentElement.classList.contains("dark")
    );
    expect(hasDarkClass).toBe(true);
  });

  test("all main views render without errors in dark mode", async ({ page }) => {
    // Week (default)
    await expect(page.getByTestId("week-view")).toBeVisible();

    // Day
    await page.getByTestId("view-day").click();
    await expect(page.getByTestId("day-view")).toBeVisible();

    // Month
    await page.getByTestId("view-month").click();
    await expect(page.getByTestId("month-view")).toBeVisible();

    // Agenda
    await page.getByTestId("view-agenda").click();
    await expect(page.getByTestId("agenda-view")).toBeVisible();
  });
});
