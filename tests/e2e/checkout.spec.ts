import { expect, test } from "@playwright/test";

test.describe("Checkout (guest, transfer)", () => {
  test("walks the 3-step form and confirms with transfer", async ({ page }) => {
    // Add a product to the cart from the product page
    await page.goto("/tienda");
    const firstCard = page.locator('a[href^="/producto/"]').first();
    await firstCard.click();

    // Click the first in-stock size (out-of-stock buttons are disabled).
    const sizeButton = page
      .locator("button:not([disabled])")
      .filter({
        hasText:
          /^(RN|0-3M|3-6M|6-9M|9-12M|12-18M|18-24M|2|3|4|6|8|10|12|14|16|XS|S|M|L|XL|Único)$/,
      })
      .first();
    await sizeButton.click();
    await page.getByRole("button", { name: /Agregar al carrito/i }).click();

    await page.goto("/checkout");

    // Step 1 — datos
    await page.getByLabel("Nombre").fill("Test");
    await page.getByLabel("Apellido").fill("Customer");
    await page.getByLabel("Email").fill("test+playwright@unilubi.dev");
    await page.getByLabel("DNI").fill("32145678");
    await page.getByLabel("Teléfono").fill("+5491155555555");
    await page.getByRole("button", { name: /Continuar/i }).click();

    // Step 2 — envío
    await page.getByLabel("Dirección").fill("Calle Test 123");
    await page.getByLabel("Ciudad").fill("CABA");
    await page.getByLabel("CP").fill("1428");
    await page.getByRole("button", { name: /Continuar/i }).click();

    // Step 3 — pago: transferencia
    await page.getByRole("button", { name: /Transferencia/i }).click();
    await page.getByRole("button", { name: /Confirmar pedido/i }).click();

    await expect(page.getByText(/¡Gracias por tu compra!/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/ULB-/)).toBeVisible();
  });
});
