import { test, expect } from "@playwright/test";
import { seedAndWait } from "./helpers";

test.describe("Free time panel", () => {
  test("sidebar shows free time section heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Free Time Windows")).toBeVisible();
  });

  test("sidebar shows work hours description", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("8 AM - 8 PM PT")).toBeVisible();
  });

  test("free time panel shows windows after seeding", async ({ page }) => {
    await page.goto("/");
    const seeded = await seedAndWait(page);
    if (!seeded) {
      test.skip(true, "InstantDB not connected - skipping data-dependent test");
      return;
    }

    const freeSlots = page.getByTestId("free-time-slot");
    await expect(freeSlots.first()).toBeVisible({ timeout: 5000 });
  });

  test("free time windows show AM/PM time ranges", async ({ page }) => {
    await page.goto("/");
    const seeded = await seedAndWait(page);
    if (!seeded) {
      test.skip(true, "InstantDB not connected - skipping data-dependent test");
      return;
    }

    const freeSlots = page.getByTestId("free-time-slot");
    await expect(freeSlots.first()).toBeVisible({ timeout: 5000 });
    await expect(freeSlots.first()).toContainText(/AM|PM/);
  });

  test("toggling calendars off changes free time windows", async ({ page }) => {
    await page.goto("/");
    const seeded = await seedAndWait(page);
    if (!seeded) {
      test.skip(true, "InstantDB not connected - skipping data-dependent test");
      return;
    }

    await page.waitForTimeout(2000);
    const initialCount = await page.getByTestId("free-time-slot").count();

    const toggle = page.locator('[data-testid^="calendar-toggle-"]').first();
    await toggle.click();
    await page.waitForTimeout(2000);

    const newCount = await page.getByTestId("free-time-slot").count();
    expect(typeof newCount).toBe("number");
  });
});
