import { NextResponse } from "next/server";
import { db, isFirebaseConfigured } from "@/lib/firebase/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  let database: "ok" | "unconfigured" | "error" = "unconfigured";
  if (isFirebaseConfigured()) {
    try { await db().collection("system_settings").limit(1).get(); database = "ok"; } catch { database = "error"; }
  }
  return NextResponse.json({ status: database === "error" ? "degraded" : "ok", database, time: new Date().toISOString() }, { status: database === "error" ? 503 : 200 });
}
