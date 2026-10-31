"use client";

export function LogoutButton() {
  return (
    <button
      type="button"
      className="mt-2 font-semibold text-brand hover:underline"
      onClick={async () => {
        await fetch("/api/auth/session", { method: "DELETE" });
        window.location.assign("/admin/login");
      }}
    >
      Sign out
    </button>
  );
}
