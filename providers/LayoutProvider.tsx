// app/providers/LayoutProvider.tsx
"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/app/components/Navbar";

export default function LayoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  if (isLoginPage) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Navbar />
      <div className="flex-1 flex flex-col pl-64">{children}</div>
    </div>
  );
}
