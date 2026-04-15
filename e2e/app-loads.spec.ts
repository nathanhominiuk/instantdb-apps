import { test, expect } from "@playwright/test";

test.describe("App loads correctly", () => {
  test("renders the app header with title", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("Calendar Coordinator")).toBeVisible();
  });

  test("displays the timezone indicator", async ({ page }) => {
    await page.goto("/");
    await expect(
      page.getByTestId("timezone-indicator")
    ).toContainText("Pacific Time");
  });

  test("shows the view selector with all 7 views", async ({ page }) => {
    await page.goto("/");
    const viewSelector = page.getByTestId("view-selector");
    await expect(viewSelector).toBeVisible();
    await expect(viewSelector.getByText("Agenda")).toBeVisible();
    await expect(viewSelector.getByText("Day")).toBeVisible();
    await expect(viewSelector.getByText("Week", { exact: true })).toBeVisible();
    await expect(viewSelector.getByText("2 Weeks", { exact: true })).toBeVisible();
    await expect(viewSelector.getByText("Month")).toBeVisible();
    await expect(viewSelector.getByText("Quarter")).toBeVisible();
    await expect(viewSelector.getByText("Year")).toBeVisible();
  });

  test("shows navigation controls (Today, Prev, Next)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("nav-today")).toBeVisible();
    await expect(page.getByTestId("nav-prev")).toBeVisible();
    await expect(page.getByTestId("nav-next")).toBeVisible();
  });

  test("shows the sidebar with seed data button", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByTestId("seed-button")).toBeVisible();
    await expect(page.getByTestId("clear-button")).toBeVisible();
  });
});
