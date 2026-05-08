import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EmptyState from "@/components/ui/EmptyState";

describe("<EmptyState />", () => {
  it("renders the title and body", () => {
    render(<EmptyState icon="bag" title="Tu carrito está vacío" body="Agregá productos antes de pagar." />);
    expect(screen.getByText("Tu carrito está vacío")).toBeInTheDocument();
    expect(screen.getByText("Agregá productos antes de pagar.")).toBeInTheDocument();
  });

  it("renders the CTA when provided", () => {
    render(
      <EmptyState
        icon="bag"
        title="Sin pedidos"
        body=""
        cta={<button>Ir a la tienda</button>}
      />,
    );
    expect(screen.getByRole("button", { name: "Ir a la tienda" })).toBeInTheDocument();
  });

  it("invokes the CTA on click", async () => {
    const user = userEvent.setup();
    let clicks = 0;
    render(
      <EmptyState
        icon="bag"
        title="Sin pedidos"
        body=""
        cta={<button onClick={() => clicks++}>Ir a la tienda</button>}
      />,
    );
    await user.click(screen.getByRole("button", { name: "Ir a la tienda" }));
    expect(clicks).toBe(1);
  });
});
