import { expect, test } from "@playwright/test";

test.describe("Home", () => {
  test("loads with hero, featured products and main nav", async ({ page }) => {
    await page.goto("/");

    // Hero copy
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/Diseño/i);

    // At least the "Best sellers" section heading
    await expect(page.getByRole("heading", { name: /Más vendidos/i })).toBeVisible();

    // Main CTA link works
    await page.getByRole("link", { name: /Quiero verla toda/i }).first().click();
    await expect(page).toHaveURL(/\/tienda$/);
  });

  test("navigates to a product page from /tienda", async ({ page }) => {
    await page.goto("/tienda");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    // Click the first product card link
    const firstCard = page.locator('a[href^="/producto/"]').first();
    await firstCard.click();

    await expect(page).toHaveURL(/\/producto\/.+/);
    // Product detail must have an "Add to cart" button
    await expect(page.getByRole("button", { name: /Agregar al carrito/i })).toBeVisible();
  });
});
