import { test, expect } from "@playwright/test";
import { seedAndWait } from "./helpers";

test.describe("Event details", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    const seeded = await seedAndWait(page);
    if (!seeded) {
      test.skip(true, "InstantDB not connected - skipping data-dependent test");
    }
  });

  test("clicking an event in agenda view opens detail modal", async ({ page }) => {
    await page.getByTestId("view-agenda").click();
    await page.waitForTimeout(1000);

    const firstEvent = page.getByTestId("event-block").first();
    await expect(firstEvent).toBeVisible({ timeout: 5000 });
    await firstEvent.click();

    const modal = page.getByTestId("event-detail-modal");
    await expect(modal).toBeVisible();
  });

  test("event detail modal shows title and time", async ({ page }) => {
    await page.getByTestId("view-agenda").click();
    await page.waitForTimeout(1000);

    const firstEvent = page.getByTestId("event-block").first();
    await expect(firstEvent).toBeVisible({ timeout: 5000 });
    await firstEvent.click();

    const modal = page.getByTestId("event-detail-modal");
    await expect(modal).toBeVisible();
    await expect(modal.getByText(/AM|PM|All day/)).toBeVisible();
  });

  test("event detail modal can be closed with button", async ({ page }) => {
    await page.getByTestId("view-agenda").click();
    await page.waitForTimeout(1000);

    const firstEvent = page.getByTestId("event-block").first();
    await expect(firstEvent).toBeVisible({ timeout: 5000 });
    await firstEvent.click();

    const modal = page.getByTestId("event-detail-modal");
    await expect(modal).toBeVisible();

    await page.getByRole("button", { name: "Close" }).click();
    await expect(modal).not.toBeVisible();
  });

  test("event detail modal can be closed with Escape", async ({ page }) => {
    await page.getByTestId("view-agenda").click();
    await page.waitForTimeout(1000);

    const firstEvent = page.getByTestId("event-block").first();
    await expect(firstEvent).toBeVisible({ timeout: 5000 });
    await firstEvent.click();

    const modal = page.getByTestId("event-detail-modal");
    await expect(modal).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(modal).not.toBeVisible();
  });

  test("clicking an event in time grid view opens detail modal", async ({ page }) => {
    await page.getByTestId("view-week").click();
    await page.waitForTimeout(1000);

    const events = page.getByTestId("event-block");
    const count = await events.count();
    if (count > 0) {
      await events.first().click();
      const modal = page.getByTestId("event-detail-modal");
      await expect(modal).toBeVisible();
    }
  });
});
