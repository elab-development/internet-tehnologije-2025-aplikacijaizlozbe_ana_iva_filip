import { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  process.env.APP_ORIGIN,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
].filter(Boolean) as string[];

export function assertSameOrigin(req: NextRequest) {
  const method = req.method.toUpperCase();
  const mutating = ["POST", "PUT", "DELETE", "PATCH"].includes(method);
  if (!mutating) return;

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (origin) {
    if (!ALLOWED_ORIGINS.includes(origin)) {
      if (origin.endsWith(".vercel.app")) return; 
      
      throw new Error("CSRF_BLOCKED");
    }
  } else if (host) {
    const isAllowedHost = ALLOWED_ORIGINS.some(allowed => allowed.includes(host));
    if (!isAllowedHost && !host.endsWith(".vercel.app")) {
      throw new Error("CSRF_BLOCKED");
    }
  }
}