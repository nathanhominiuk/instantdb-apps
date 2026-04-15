import { test, expect } from "@playwright/test";

test.describe("Right panel with free time", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("right panel is visible", async ({ page }) => {
    await expect(page.getByTestId("right-panel")).toBeVisible();
  });

  test("free time heading appears in right panel", async ({ page }) => {
    await expect(page.getByText("Free Time Windows")).toBeVisible();
  });

  test("free time description is visible", async ({ page }) => {
    await expect(page.getByText("8 AM - 8 PM PT")).toBeVisible();
  });

  test("right panel has collapse toggle", async ({ page }) => {
    await expect(page.getByTestId("right-panel-toggle")).toBeVisible();
  });
});
