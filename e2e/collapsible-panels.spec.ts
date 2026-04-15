import { test, expect } from "@playwright/test";

test.describe("Collapsible panels", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage to start fresh
    await page.goto("/");
    await page.evaluate(() => localStorage.removeItem("calendar-settings"));
    await page.reload();
  });

  test("left sidebar toggle is visible", async ({ page }) => {
    await expect(page.getByTestId("sidebar-toggle")).toBeVisible();
  });

  test("collapsing left sidebar hides calendar content", async ({ page }) => {
    // Calendars heading should be visible initially
    await expect(page.getByText("Calendars")).toBeVisible();
    // Click collapse
    await page.getByTestId("sidebar-toggle").click();
    // Content should be hidden
    await expect(page.getByText("Calendars")).not.toBeVisible();
  });

  test("expanding left sidebar restores content", async ({ page }) => {
    // Collapse
    await page.getByTestId("sidebar-toggle").click();
    await expect(page.getByText("Calendars")).not.toBeVisible();
    // Expand
    await page.getByTestId("sidebar-toggle").click();
    await expect(page.getByText("Calendars")).toBeVisible();
  });

  test("right panel collapse/expand works", async ({ page }) => {
    await expect(page.getByText("Free Time Windows")).toBeVisible();
    // Collapse
    await page.getByTestId("right-panel-toggle").click();
    await expect(page.getByText("Free Time Windows")).not.toBeVisible();
    // Expand
    await page.getByTestId("right-panel-toggle").click();
    await expect(page.getByText("Free Time Windows")).toBeVisible();
  });
});
