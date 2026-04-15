import { type Page, expect } from "@playwright/test";

/**
 * Seeds the database and waits for data to appear.
 * Returns true if seeding succeeded, false if DB is not connected.
 */
export async function seedAndWait(page: Page): Promise<boolean> {
  await page.getByTestId("clear-button").click();
  await page.waitForTimeout(1000);
  await page.getByTestId("seed-button").click();
  try {
    await expect(page.getByText("Alice Chen")).toBeVisible({ timeout: 10000 });
    return true;
  } catch {
    return false;
  }
}
