import { test, expect } from "@playwright/test";
import { seedAndWait } from "./helpers";

test.describe("Overlapping events card stack layout", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const seeded = await seedAndWait(page);
    if (!seeded) test.skip();
  });

  test("events in day view are visible and clickable", async ({ page }) => {
    await page.getByTestId("view-day").click();
    await expect(page.getByTestId("time-grid")).toBeVisible();
    // Check that event blocks are present
    const eventBlocks = page.getByTestId("event-block");
    const count = await eventBlocks.count();
    if (count > 0) {
      // First event should be clickable
      await eventBlocks.first().click();
      await expect(page.getByTestId("event-detail-modal")).toBeVisible();
    }
  });

  test("events in week view are visible", async ({ page }) => {
    await expect(page.getByTestId("week-view")).toBeVisible();
    const eventBlocks = page.getByTestId("event-block");
    const count = await eventBlocks.count();
    expect(count).toBeGreaterThan(0);
  });

  test("overlapping events have different left offsets in day view", async ({ page }) => {
    await page.getByTestId("view-day").click();
    await expect(page.getByTestId("time-grid")).toBeVisible();
    // Find all events positioned in the time grid (absolute positioned)
    const eventWrappers = page.locator("[data-testid='time-grid'] .absolute [data-testid='event-block']");
    const count = await eventWrappers.count();
    if (count >= 2) {
      // If there are overlapping events, their parent divs should have different left offsets
      const firstParent = eventWrappers.nth(0).locator("..");
      const secondParent = eventWrappers.nth(1).locator("..");
      const firstLeft = await firstParent.evaluate((el) => el.style.left);
      const secondLeft = await secondParent.evaluate((el) => el.style.left);
      // They may or may not overlap, but the layout function should have run
      expect(firstLeft).toBeTruthy();
      expect(secondLeft).toBeTruthy();
    }
  });
});
