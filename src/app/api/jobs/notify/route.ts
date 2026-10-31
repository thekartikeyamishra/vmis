import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { processPendingJobs } from "@/lib/notify";
import { isFirebaseConfigured } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Call from a scheduler (Cloud Scheduler / Vercel Cron) with `Authorization: Bearer $CRON_SECRET`. */
export async function POST(req: Request) {
  const secret = process.env.CRON_SECRET ?? "";
  const given = (req.headers.get("authorization") ?? "").replace(/^Bearer /, "");
  const ok = secret.length >= 16 && given.length === secret.length && timingSafeEqual(Buffer.from(given), Buffer.from(secret));
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!isFirebaseConfigured()) return NextResponse.json({ error: "unavailable" }, { status: 503 });
  return NextResponse.json(await processPendingJobs());
}
export const GET = POST;
