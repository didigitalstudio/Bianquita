import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const metadata = { title: "Pago rechazado" };

export default async function PagoErrorPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <div className="container" style={{ padding: "80px 24px", maxWidth: 640 }}>
      <div style={{ textAlign: "center", padding: "48px 32px", background: "var(--cream)", borderRadius: 22 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "rgba(170,80,80,0.12)", color: "#a55", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icon name="x" size={36} />
        </div>
        <h1 className="h2" style={{ marginBottom: 12 }}>El pago fue rechazado</h1>
        {order && <p className="muted" style={{ marginBottom: 8 }}>Pedido <strong style={{ color: "var(--brand)" }}>{order}</strong></p>}
        <p className="soft" style={{ marginBottom: 32 }}>Probá con otra tarjeta o medio de pago. Si necesitás ayuda, escribinos por WhatsApp.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/checkout" className="btn btn-primary">Reintentar</Link>
          <Link href="/contacto" className="btn btn-ghost">Contactarnos</Link>
        </div>
      </div>
    </div>
  );
}
