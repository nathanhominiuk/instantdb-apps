import { type Page, expect } from "@playwright/test";

/**
 * Seeds the database and waits for data to appear.
 * The seed function internally clears existing data first.
 * Returns true if seeding succeeded, false if DB is not connected.
 */
export async function seedAndWait(page: Page): Promise<boolean> {
  await page.getByTestId("seed-button").click();
  try {
    await expect(page.getByText("Alice Chen").first()).toBeVisible({ timeout: 20000 });
    return true;
  } catch {
    return false;
  }
}
