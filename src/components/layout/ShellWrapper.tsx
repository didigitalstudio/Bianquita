"use client";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Toast from "@/components/ui/Toast";

interface Props {
  children: React.ReactNode;
  isAdminUser?: boolean;
}

export default function ShellWrapper({ children, isAdminUser = false }: Props) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) return <>{children}</>;

  return (
    <>
      <Navbar isAdminUser={isAdminUser} />
      <main>{children}</main>
      <Footer />
      <Toast />
    </>
  );
}
