import Image from "next/image";
import Link from "next/link";
import type { StaffUser } from "@/lib/auth/session";
import { can, ROLE_LABELS, type Capability } from "@/lib/auth/roles";
import { LogoutButton } from "./LogoutButton";

const NAV: { href: string; label: string; cap: Capability }[] = [
  { href: "/admin", label: "Dashboard", cap: "viewEnquiries" },
  { href: "/admin/enquiries", label: "Enquiries", cap: "viewEnquiries" },
  { href: "/admin/levels", label: "Academic levels", cap: "manageContent" },
  { href: "/admin/announcements", label: "News & events", cap: "manageContent" },
  { href: "/admin/documents", label: "Public disclosure", cap: "manageContent" },
  { href: "/admin/settings", label: "School settings", cap: "manageSettings" },
  { href: "/admin/users", label: "Users & roles", cap: "manageUsers" },
  { href: "/admin/audit", label: "Audit log", cap: "viewAudit" },
];

export function Shell({ user, title, children, flash }: { user: StaffUser; title: string; children: React.ReactNode; flash?: { ok?: string; error?: string } }) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="border-b border-brand/10 bg-white p-4 lg:min-h-screen lg:border-b-0 lg:border-r">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/brand/vmis-logo-128.webp" alt="" width={40} height={40} className="rounded-full" />
          <span className="font-extrabold text-brand-900">VMIS Admin</span>
        </Link>
        <nav aria-label="Admin" className="mt-6">
          <ul className="flex flex-wrap gap-1 lg:block lg:space-y-1">
            {NAV.filter((n) => can(user.role, n.cap)).map((n) => (
              <li key={n.href}><Link href={n.href} className="block rounded-lg px-3 py-2 text-sm font-semibold text-ink hover:bg-bg hover:text-brand">{n.label}</Link></li>
            ))}
            <li><a href="/en" target="_blank" className="block rounded-lg px-3 py-2 text-sm text-muted hover:bg-bg">View website ↗</a></li>
          </ul>
        </nav>
        <div className="mt-6 rounded-xl bg-bg p-3 text-xs">
          <p className="truncate font-semibold">{user.email}</p>
          <p className="text-muted">{ROLE_LABELS[user.role]}</p>
          <LogoutButton />
        </div>
      </aside>
      <main className="p-4 sm:p-8">
        <h1 className="text-2xl font-extrabold">{title}</h1>
        {flash?.ok && <p role="status" className="mt-4 rounded-xl bg-[#E3F6F3] p-3 text-sm font-semibold text-[#1B7B73]">Saved successfully.</p>}
        {flash?.error && <p role="alert" className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">Could not save: {flash.error}. Please check the form and try again.</p>}
        <div className="mt-6">{children}</div>
      </main>
    </div>
  );
}

export const fmtDate = (v: unknown) => {
  const d = v && typeof v === "object" && "toDate" in v ? (v as { toDate(): Date }).toDate() : v instanceof Date ? v : typeof v === "string" ? new Date(v) : null;
  return d && !isNaN(d.getTime()) ? d.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" }) : "—";
};

export const STATUS_LABEL: Record<string, string> = {
  new: "New", contacted: "Contacted", visit_scheduled: "Visit scheduled", visited: "Visited", application_issued: "Application issued",
  admitted: "Admitted", not_interested: "Not interested", closed: "Closed",
};
