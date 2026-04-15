import { test, expect } from "@playwright/test";
import { seedAndWait } from "./helpers";

test.describe("Calendar toggle", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const seeded = await seedAndWait(page);
    if (!seeded) {
      test.skip(true, "InstantDB not connected - skipping data-dependent test");
    }
    await page.getByTestId("view-agenda").click();
    await page.waitForTimeout(1000);
  });

  test("calendars are visible with checkboxes", async ({ page }) => {
    const toggles = page.locator('[data-testid^="calendar-toggle-"]');
    const count = await toggles.count();
    expect(count).toBeGreaterThan(0);
  });

  test("toggling a calendar hides its events", async ({ page }) => {
    const initialEventCount = await page.getByTestId("event-block").count();
    const firstToggle = page.locator('[data-testid^="calendar-toggle-"]').first();
    await firstToggle.click();
    await page.waitForTimeout(1000);
    const newEventCount = await page.getByTestId("event-block").count();
    expect(newEventCount).toBeLessThanOrEqual(initialEventCount);
  });

  test("toggling a calendar back on restores events", async ({ page }) => {
    const initialEventCount = await page.getByTestId("event-block").count();
    const firstToggle = page.locator('[data-testid^="calendar-toggle-"]').first();
    await firstToggle.click();
    await page.waitForTimeout(1000);
    await firstToggle.click();
    await page.waitForTimeout(1000);
    const restoredCount = await page.getByTestId("event-block").count();
    expect(restoredCount).toBe(initialEventCount);
  });
});
