"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { clientAuth } from "@/lib/firebase/client";

const MESSAGES: Record<string, string> = {
  not_staff: "This account does not have staff access.",
  rate_limited: "Too many attempts. Please wait and try again.",
  unavailable: "Server is not configured yet.",
};

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const f = new FormData(e.currentTarget);
    try {
      const auth = clientAuth();
      const cred = await signInWithEmailAndPassword(auth, String(f.get("email")), String(f.get("password")));
      const idToken = await cred.user.getIdToken(true);
      const res = await fetch("/api/auth/session", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idToken }) });
      await signOut(auth); // no client-side session is kept
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        setError(MESSAGES[j.error ?? ""] ?? "Sign-in failed.");
        return;
      }
      window.location.assign("/admin");
    } catch {
      setError("Incorrect email or password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}
      <div><label htmlFor="email" className="field-label">Email</label><input id="email" name="email" type="email" required autoComplete="username" className="field" /></div>
      <div><label htmlFor="password" className="field-label">Password</label><input id="password" name="password" type="password" required autoComplete="current-password" className="field" /></div>
      <button className="btn-primary w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
    </form>
  );
}
