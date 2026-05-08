import Icon from "./Icon";

interface EmptyStateProps {
  icon: string;
  title: string;
  body: string;
  cta?: React.ReactNode;
}

export default function EmptyState({ icon, title, body, cta }: EmptyStateProps) {
  return (
    <div style={{ textAlign: "center", padding: "64px 24px", maxWidth: 420, margin: "0 auto" }}>
      <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", color: "var(--brand)" }}>
        <Icon name={icon} size={28} />
      </div>
      <div className="h3" style={{ marginBottom: 8 }}>{title}</div>
      <p className="muted" style={{ fontSize: 14, marginBottom: 20 }}>{body}</p>
      {cta}
    </div>
  );
}
