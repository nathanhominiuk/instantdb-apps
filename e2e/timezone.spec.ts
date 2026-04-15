import { test, expect } from "@playwright/test";
import { seedAndWait } from "./helpers";

test.describe("Timezone display", () => {
  test("header displays Pacific Time indicator", async ({ page }) => {
    await page.goto("/");
    const indicator = page.getByTestId("timezone-indicator");
    await expect(indicator).toBeVisible();
    await expect(indicator).toContainText("Pacific Time");
    await expect(indicator).toContainText("PT");
  });

  test("sidebar mentions Pacific Time for free time windows", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("8 AM - 8 PM PT")).toBeVisible();
  });

  test("time grid shows hour labels in 12-hour format", async ({ page }) => {
    await page.goto("/");
    // Week view has time grid with hour labels
    await expect(page.getByTestId("time-grid")).toBeVisible();
    const pageText = await page.textContent("body");
    expect(pageText).toMatch(/12 AM/);
    expect(pageText).toMatch(/12 PM/);
  });

  test("event times in agenda view display AM/PM format", async ({ page }) => {
    await page.goto("/");
    const seeded = await seedAndWait(page);
    if (!seeded) {
      test.skip(true, "InstantDB not connected - skipping data-dependent test");
      return;
    }

    await page.getByTestId("view-agenda").click();
    await page.waitForTimeout(1000);

    const events = page.getByTestId("event-block");
    await expect(events.first()).toBeVisible({ timeout: 5000 });

    const pageText = await page.textContent("body");
    expect(pageText).toMatch(/\d{1,2}:\d{2}\s*(AM|PM)/);
  });

  test("event detail modal shows PT timezone", async ({ page }) => {
    await page.goto("/");
    const seeded = await seedAndWait(page);
    if (!seeded) {
      test.skip(true, "InstantDB not connected - skipping data-dependent test");
      return;
    }

    await page.getByTestId("view-agenda").click();
    await page.waitForTimeout(1000);

    const firstEvent = page.getByTestId("event-block").first();
    await expect(firstEvent).toBeVisible({ timeout: 5000 });
    await firstEvent.click();

    const modal = page.getByTestId("event-detail-modal");
    await expect(modal).toBeVisible();
    await expect(modal).toContainText("PT");
  });
});
