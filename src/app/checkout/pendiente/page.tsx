import Link from "next/link";
import Icon from "@/components/ui/Icon";

export const metadata = { title: "Pago pendiente" };

export default async function PagoPendientePage({ searchParams }: { searchParams: Promise<{ order?: string }> }) {
  const { order } = await searchParams;
  return (
    <div className="container" style={{ padding: "80px 24px", maxWidth: 640 }}>
      <div style={{ textAlign: "center", padding: "48px 32px", background: "var(--cream)", borderRadius: 22 }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "var(--brand-soft)", color: "var(--brand)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <Icon name="clock" size={36} />
        </div>
        <h1 className="h2" style={{ marginBottom: 12 }}>Pago pendiente de confirmación</h1>
        {order && <p className="muted" style={{ marginBottom: 8 }}>Pedido <strong style={{ color: "var(--brand)" }}>{order}</strong></p>}
        <p className="soft" style={{ marginBottom: 32 }}>Cuando MercadoPago confirme el pago te avisamos por email. Si pagaste por transferencia, vamos a procesar el pedido al recibir la acreditación.</p>
        <Link href="/cuenta" className="btn btn-primary">Ver mis pedidos</Link>
      </div>
    </div>
  );
}
