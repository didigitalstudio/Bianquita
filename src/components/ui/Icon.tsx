interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
  className?: string;
}

export default function Icon({ name, size = 20, stroke = 1.6, className }: IconProps) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const, className,
  };
  switch (name) {
    case "search": return <svg {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>;
    case "bag": return <svg {...props}><path d="M5 7h14l-1 13H6L5 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>;
    case "user": return <svg {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg>;
    case "heart": return <svg {...props}><path d="M12 20s-7-4.5-9.5-9A5 5 0 0 1 12 6.5 5 5 0 0 1 21.5 11C19 15.5 12 20 12 20Z"/></svg>;
    case "menu": return <svg {...props}><path d="M4 7h16M4 12h16M4 17h16"/></svg>;
    case "x": return <svg {...props}><path d="M6 6l12 12M18 6 6 18"/></svg>;
    case "plus": return <svg {...props}><path d="M12 5v14M5 12h14"/></svg>;
    case "minus": return <svg {...props}><path d="M5 12h14"/></svg>;
    case "arrow-right": return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>;
    case "arrow-left": return <svg {...props}><path d="M19 12H5M11 6l-6 6 6 6"/></svg>;
    case "chevron-down": return <svg {...props}><path d="m6 9 6 6 6-6"/></svg>;
    case "chevron-right": return <svg {...props}><path d="m9 6 6 6-6 6"/></svg>;
    case "check": return <svg {...props}><path d="m5 12 5 5 9-11"/></svg>;
    case "filter": return <svg {...props}><path d="M3 6h18M6 12h12M10 18h4"/></svg>;
    case "truck": return <svg {...props}><path d="M3 7h11v10H3zM14 10h4l3 3v4h-7"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/></svg>;
    case "shield": return <svg {...props}><path d="M12 3 4 6v6c0 4.5 3.5 8 8 9 4.5-1 8-4.5 8-9V6l-8-3Z"/></svg>;
    case "gift": return <svg {...props}><path d="M3 11h18v10H3zM12 11v10M3 7h18v4H3zM12 7s-3-4-5-3-1 3 1 3M12 7s3-4 5-3 1 3-1 3"/></svg>;
    case "sparkle": return <svg {...props}><path d="M12 3v6M12 15v6M3 12h6M15 12h6"/></svg>;
    case "trash": return <svg {...props}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>;
    case "edit": return <svg {...props}><path d="M4 20h4l10-10-4-4L4 16v4Z"/><path d="m13 6 4 4"/></svg>;
    case "eye": return <svg {...props}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>;
    case "box": return <svg {...props}><path d="M3 7l9-4 9 4-9 4-9-4ZM3 7v10l9 4 9-4V7M12 11v10"/></svg>;
    case "mail": return <svg {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>;
    case "phone": return <svg {...props}><path d="M5 4h4l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"/></svg>;
    case "instagram": return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8" fill="currentColor"/></svg>;
    case "whatsapp": return <svg {...props}><path d="M3 21l1.6-5A8 8 0 1 1 8 19l-5 2Z"/><path d="M9 10c0 4 3 6 5 6l1-2-2-1-1 1c-1 0-2-1-2-2l1-1-1-2-2 1Z"/></svg>;
    case "map": return <svg {...props}><path d="M12 22s-7-7-7-13a7 7 0 0 1 14 0c0 6-7 13-7 13Z"/><circle cx="12" cy="9" r="2.5"/></svg>;
    case "home": return <svg {...props}><path d="M3 11 12 4l9 7v9a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1v-9Z"/></svg>;
    case "grid": return <svg {...props}><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>;
    case "list": return <svg {...props}><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>;
    case "trend": return <svg {...props}><path d="M3 17l6-6 4 4 8-8M14 7h7v7"/></svg>;
    case "card": return <svg {...props}><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11h18"/></svg>;
    case "bank": return <svg {...props}><path d="M3 9l9-5 9 5M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18"/></svg>;
    case "clock": return <svg {...props}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>;
    case "star": return <svg {...props}><path d="M12 4l2.5 5.2 5.5.8-4 4 1 5.5L12 17l-5 2.5 1-5.5-4-4 5.5-.8L12 4Z"/></svg>;
    case "logout": return <svg {...props}><path d="M9 4H5v16h4M16 12H9M14 8l4 4-4 4"/></svg>;
    case "tag": return <svg {...props}><path d="M3 12V3h9l9 9-9 9-9-9Z"/><circle cx="8" cy="8" r="1.5" fill="currentColor"/></svg>;
    default: return null;
  }
}
