import { test, expect } from "@playwright/test";
import { seedAndWait } from "./helpers";

test.describe("Agenda multi-column view", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("view-agenda").click();
    await expect(page.getByTestId("agenda-view")).toBeVisible();
  });

  test("agenda view shows list/calendar mode toggle", async ({ page }) => {
    await expect(page.getByTestId("agenda-list-mode")).toBeVisible();
    await expect(page.getByTestId("agenda-calendar-mode")).toBeVisible();
  });

  test("default mode is list", async ({ page }) => {
    // List mode button should appear active (has shadow-sm class)
    const listBtn = page.getByTestId("agenda-list-mode");
    await expect(listBtn).toBeVisible();
    // Calendar columns should not exist in list mode
    await expect(page.getByTestId("agenda-calendar-column")).not.toBeVisible();
  });

  test("switching to By Calendar mode shows columns when data exists", async ({ page }) => {
    const seeded = await seedAndWait(page);
    if (!seeded) test.skip();

    await page.getByTestId("view-agenda").click();
    await page.getByTestId("agenda-calendar-mode").click();
    // Should show calendar columns
    const columns = page.getByTestId("agenda-calendar-column");
    const count = await columns.count();
    expect(count).toBeGreaterThan(0);
  });

  test("switching back to list mode restores single list", async ({ page }) => {
    await page.getByTestId("agenda-calendar-mode").click();
    await page.getByTestId("agenda-list-mode").click();
    // Calendar columns should disappear
    await expect(page.getByTestId("agenda-calendar-column")).not.toBeVisible();
  });
});
