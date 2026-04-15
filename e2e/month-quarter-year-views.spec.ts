import { test, expect } from "@playwright/test";

test.describe("Month, Quarter, and Year views render correctly", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("month view renders month grid with visible day cells", async ({ page }) => {
    await page.getByTestId("view-month").click();
    await expect(page.getByTestId("month-view")).toBeVisible();
    await expect(page.getByTestId("month-grid")).toBeVisible();
    // Weekday headers should be visible
    await expect(page.getByText("Sun")).toBeVisible();
    await expect(page.getByText("Mon")).toBeVisible();
  });

  test("quarter view renders 3 month grids", async ({ page }) => {
    await page.getByTestId("view-quarter").click();
    await expect(page.getByTestId("quarter-view")).toBeVisible();
    const grids = page.getByTestId("month-grid");
    await expect(grids).toHaveCount(3);
    // Each grid should have non-zero dimensions
    for (let i = 0; i < 3; i++) {
      const box = await grids.nth(i).boundingBox();
      expect(box).toBeTruthy();
      expect(box!.height).toBeGreaterThan(50);
    }
  });

  test("year view renders 12 month grids", async ({ page }) => {
    await page.getByTestId("view-year").click();
    await expect(page.getByTestId("year-view")).toBeVisible();
    const grids = page.getByTestId("month-grid");
    await expect(grids).toHaveCount(12);
    // First grid should be visible
    const box = await grids.first().boundingBox();
    expect(box).toBeTruthy();
    expect(box!.height).toBeGreaterThan(20);
  });
});
