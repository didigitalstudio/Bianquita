import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  inverted?: boolean;
}

const SIZES = { sm: 24, md: 32, lg: 56 };

export default function Logo({ size = "md", inverted = false }: LogoProps) {
  const h = SIZES[size];
  return (
    <Image
      src="/logo.png"
      alt="Unilubi Kids"
      height={h}
      width={h * 3}
      style={{ height: h, width: "auto", filter: inverted ? "brightness(0) invert(1)" : "none" }}
      priority
    />
  );
}
