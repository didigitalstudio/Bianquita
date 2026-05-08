"use client";

import { useState } from "react";
import Image from "next/image";

interface ProductImageProps {
  src: string;
  alt: string;
  label?: string;
  fill?: boolean;
}

export default function ProductImage({ src, alt, label, fill = true }: ProductImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return (
      <div style={{ width: "100%", height: "100%", background: "linear-gradient(135deg, var(--brand-soft), var(--cream-2))", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--brand-deep)", fontFamily: "ui-monospace, monospace", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase" }}>
        {label || "imagen"}
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        style={{ objectFit: "cover" }}
        onError={() => setErrored(true)}
        sizes="(max-width: 768px) 50vw, 25vw"
      />
    );
  }

  return (
    <img src={src} alt={alt} onError={() => setErrored(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
  );
}
