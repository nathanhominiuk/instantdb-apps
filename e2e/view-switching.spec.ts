import { test, expect } from "@playwright/test";

test.describe("View switching", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("default view is week", async ({ page }) => {
    await expect(page.getByTestId("week-view")).toBeVisible();
  });

  test("can switch to agenda view", async ({ page }) => {
    await page.getByTestId("view-agenda").click();
    await expect(page.getByTestId("agenda-view")).toBeVisible();
  });

  test("can switch to day view", async ({ page }) => {
    await page.getByTestId("view-day").click();
    await expect(page.getByTestId("day-view")).toBeVisible();
  });

  test("can switch to week view", async ({ page }) => {
    await page.getByTestId("view-day").click(); // switch away first
    await page.getByTestId("view-week").click();
    await expect(page.getByTestId("week-view")).toBeVisible();
  });

  test("can switch to fortnight view", async ({ page }) => {
    await page.getByTestId("view-fortnight").click();
    await expect(page.getByTestId("fortnight-view")).toBeVisible();
  });

  test("can switch to month view", async ({ page }) => {
    await page.getByTestId("view-month").click();
    await expect(page.getByTestId("month-view")).toBeVisible();
  });

  test("can switch to quarter view", async ({ page }) => {
    await page.getByTestId("view-quarter").click();
    await expect(page.getByTestId("quarter-view")).toBeVisible();
  });

  test("can switch to year view", async ({ page }) => {
    await page.getByTestId("view-year").click();
    await expect(page.getByTestId("year-view")).toBeVisible();
  });

  test("time grid is shown in day/week/fortnight views", async ({ page }) => {
    await page.getByTestId("view-day").click();
    await expect(page.getByTestId("time-grid")).toBeVisible();

    await page.getByTestId("view-week").click();
    await expect(page.getByTestId("time-grid")).toBeVisible();

    await page.getByTestId("view-fortnight").click();
    await expect(page.getByTestId("time-grid")).toBeVisible();
  });

  test("month grid is shown in month view", async ({ page }) => {
    await page.getByTestId("view-month").click();
    await expect(page.getByTestId("month-grid")).toBeVisible();
  });
});
