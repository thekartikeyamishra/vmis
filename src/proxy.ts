import { NextResponse, type NextRequest } from "next/server";

const LOCALES = ["en", "hi"];

/**
 * - Redirects un-prefixed public URLs to /en or /hi (Accept-Language aware).
 * - Maintenance mode for the public site (admin + APIs stay reachable).
 * - Fast redirect to the admin login when no session cookie exists
 *   (real verification + role checks happen server-side on every admin request).
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const first = pathname.split("/")[1] ?? "";

  if (pathname.startsWith("/admin")) {
    if (pathname !== "/admin/login" && !req.cookies.get("__session")) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
    return NextResponse.next();
  }

  if (process.env.MAINTENANCE_MODE === "true" && pathname !== "/maintenance") {
    return NextResponse.rewrite(new URL("/maintenance", req.url), { status: 503 });
  }

  if (!LOCALES.includes(first) && pathname !== "/maintenance") {
    const langs = (req.headers.get("accept-language") ?? "").toLowerCase().split(",").map((s) => s.trim().slice(0, 2));
    const hi = langs.indexOf("hi"), en = langs.indexOf("en");
    const prefersHindi = hi !== -1 && (en === -1 || hi < en);
    const url = req.nextUrl.clone();
    url.pathname = `/${prefersHindi ? "hi" : "en"}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Skip API, Next internals and static files (anything with a dot).
  matcher: ["/((?!api|_next/static|_next/image|brand|media|photos|favicon.ico|apple-icon.png|.*\\..*).*)"],
};
