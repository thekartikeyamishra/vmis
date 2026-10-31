import { NextResponse } from "next/server";
import { bucket, db, C, isFirebaseConfigured } from "@/lib/firebase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Public download of a PUBLISHED disclosure document via a short-lived signed URL (bucket stays private). */
export async function GET(_req: Request, ctx: RouteContext<"/api/documents/[id]">) {
  const { id } = await ctx.params;
  if (!isFirebaseConfigured() || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const doc = await db().collection(C.publicDocuments).doc(id).get();
  if (!doc.exists || doc.get("status") !== "published") return NextResponse.json({ error: "not_found" }, { status: 404 });
  const [url] = await bucket().file(doc.get("storagePath")).getSignedUrl({
    action: "read", expires: Date.now() + 10 * 60_000, responseDisposition: `inline; filename="${String(doc.get("fileName") ?? "document.pdf").replace(/[^\w.\- ]/g, "_")}"`,
  });
  return NextResponse.redirect(url, 302);
}
