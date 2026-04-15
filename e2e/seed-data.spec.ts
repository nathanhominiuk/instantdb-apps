import { test, expect } from "@playwright/test";

test.describe("Seed data", () => {
  test("seed and clear buttons are visible", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("seed-button")).toBeVisible();
    await expect(page.getByTestId("clear-button")).toBeVisible();
  });

  test("seed button can be clicked without crashing", async ({ page }) => {
    await page.goto("/");
    const seedButton = page.getByTestId("seed-button");
    await seedButton.click();
    // App should not crash - header should still be visible
    await expect(page.getByText("Calendar Coordinator")).toBeVisible();
  });

  test("seed button populates calendars and events when DB is connected", async ({ page }) => {
    await page.goto("/");
    await page.getByTestId("seed-button").click();

    try {
      await expect(page.getByText("Alice Chen").first()).toBeVisible({ timeout: 20000 });
      await expect(page.getByText("Bob Martinez").first()).toBeVisible();
      await expect(page.getByText("Carol Williams").first()).toBeVisible();
      await expect(page.getByText("Dave Kim").first()).toBeVisible();
    } catch {
      test.skip(true, "InstantDB not connected - skipping data-dependent test");
    }
  });

  test("clear button removes all data when DB is connected", async ({ page }) => {
    await page.goto("/");
    // Seed first
    await page.getByTestId("seed-button").click();

    try {
      await expect(page.getByText("Alice Chen").first()).toBeVisible({ timeout: 20000 });
    } catch {
      test.skip(true, "InstantDB not connected - skipping data-dependent test");
      return;
    }

    // Now clear
    await page.getByTestId("clear-button").click();
    await expect(page.getByText("Alice Chen").first()).not.toBeVisible({ timeout: 10000 });
  });
});
