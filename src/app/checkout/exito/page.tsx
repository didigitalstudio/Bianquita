import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const metadata = { title: "Pago aprobado" };

export default async function PagoExitoPage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <div className="container" style={{ padding: "80px 24px", maxWidth: 640 }}>
      <div style={{ textAlign: "center", padding: "48px 32px", background: "var(--cream)", borderRadius: 22 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--salvia)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icon name="check" size={36} />
        </div>
        <h1 className="h2" style={{ marginBottom: 12 }}>¡Pago aprobado!</h1>
        {order && <p className="muted" style={{ marginBottom: 8 }}>Pedido <strong style={{ color: "var(--brand)" }}>{order}</strong></p>}
        <p className="soft" style={{ marginBottom: 32 }}>Recibimos tu pago. Te enviamos un mail de confirmación con todos los detalles.</p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <Link href="/cuenta" className="btn btn-primary">Ver mis pedidos</Link>
          <Link href="/" className="btn btn-ghost">Volver al inicio</Link>
        </div>
      </div>
    </div>
  );
}
