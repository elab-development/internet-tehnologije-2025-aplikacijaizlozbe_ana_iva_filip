import { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  process.env.APP_ORIGIN, 
].filter(Boolean) as string[];

export function assertSameOrigin(req: NextRequest) {
  const method = req.method.toUpperCase();
  const mutating = ["POST", "PUT",  "DELETE"].includes(method);
  if (!mutating) return;

  const origin = req.headers.get("origin");
  if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
    throw new Error("CSRF_BLOCKED");
  }
}