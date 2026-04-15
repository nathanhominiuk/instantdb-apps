import { test, expect } from "@playwright/test";

test.describe("Settings modal", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("settings button is visible in header", async ({ page }) => {
    await expect(page.getByTestId("settings-button")).toBeVisible();
  });

  test("clicking settings button opens settings modal", async ({ page }) => {
    await page.getByTestId("settings-button").click();
    await expect(page.getByTestId("settings-modal")).toBeVisible();
    await expect(page.getByText("Settings")).toBeVisible();
  });

  test("settings modal can be closed", async ({ page }) => {
    await page.getByTestId("settings-button").click();
    await expect(page.getByTestId("settings-modal")).toBeVisible();
    // Close with Escape
    await page.keyboard.press("Escape");
    await expect(page.getByTestId("settings-modal")).not.toBeVisible();
  });

  test("settings modal has tabs", async ({ page }) => {
    await page.getByTestId("settings-button").click();
    await expect(page.getByTestId("settings-tab-feeds")).toBeVisible();
    await expect(page.getByTestId("settings-tab-datetime")).toBeVisible();
    await expect(page.getByTestId("settings-tab-appearance")).toBeVisible();
  });

  test("can add and remove a calendar feed", async ({ page }) => {
    await page.getByTestId("settings-button").click();
    // Fill in feed form
    await page.getByTestId("feed-name-input").fill("Test Calendar");
    await page.getByTestId("feed-url-input").fill("https://example.com/cal.ics");
    await page.getByTestId("add-feed-button").click();
    // Feed should appear in the list
    await expect(page.getByTestId("feed-item")).toBeVisible();
    await expect(page.getByText("Test Calendar")).toBeVisible();
    // Remove feed
    await page.getByTestId("remove-feed-button").click();
    await expect(page.getByTestId("feed-item")).not.toBeVisible();
  });

  test("can switch to 24-hour time format", async ({ page }) => {
    await page.getByTestId("settings-button").click();
    await page.getByTestId("settings-tab-datetime").click();
    // Click 24h radio
    await page.getByText("24-hour (15:30)").click();
    // Close settings
    await page.keyboard.press("Escape");
    // In the time grid (default week view), hour labels should show 24h format
    await expect(page.getByText("00:00")).toBeVisible();
  });

  test("can switch theme in appearance tab", async ({ page }) => {
    await page.getByTestId("settings-button").click();
    await page.getByTestId("settings-tab-appearance").click();
    await expect(page.getByTestId("theme-light")).toBeVisible();
    await expect(page.getByTestId("theme-dark")).toBeVisible();
  });
});
