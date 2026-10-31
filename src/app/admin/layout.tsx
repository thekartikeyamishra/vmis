import "@fontsource-variable/plus-jakarta-sans";
import "../globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: { default: "VMIS Admin", template: "%s · VMIS Admin" }, robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className="bg-bg" suppressHydrationWarning>{children}</body>
    </html>
  );
}
