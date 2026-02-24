import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  process.env.APP_ORIGIN,
].filter(Boolean) as string[];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // CORS samo za /api
  if (!pathname.startsWith("/api")) return NextResponse.next();

  const origin = req.headers.get("origin") || "";
  const res = NextResponse.next();

  if (ALLOWED_ORIGINS.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin);
    res.headers.set("Vary", "Origin");
    res.headers.set("Access-Control-Allow-Credentials", "true");
    res.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET,POST,PUT,DELETE,OPTIONS"
    );
  }

  // Preflight
  if (req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: res.headers });
  }

  return res;
}

export const config = {
  matcher: ["/api/:path*"],
};